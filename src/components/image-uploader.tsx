"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";

// Initialize Cloudinary with Vite environment variables
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

export function ImageUploader() {
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const uploadToBackend = async (file: File) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const response = await fetch(
        import.meta.env.VITE_UPLOAD_ENDPOINT ||
          "http://localhost:3001/artworks/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const { url } = await response.json();

      await addDoc(collection(db, "images"), {
        url,
        createdAt: new Date(),
        id: uuidv4(),
      });

      return url;
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
      throw err;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setIsUploading(true);
    setProgress(0);
    setImageUrl(null);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      const url = await uploadToBackend(acceptedFiles[0]);
      setImageUrl(url);

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    } catch {
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled: isUploading,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive ? "border-primary bg-accent/50" : "border-muted"
          } transition-colors`}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <div className="space-y-4">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">
                Uploading... {progress}%
              </p>
            </div>
          ) : imageUrl ? (
            <div className="space-y-2">
              <AdvancedImage
                cldImg={cld.image(imageUrl)}
                className="rounded-md mx-auto max-h-60"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Upload successful! Drag to replace or click to select another.
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                {" "}
                {/* ✅ 3. Button */}
                View Gallery
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag & drop an image here, or click to select"}
              </p>
              <Button type="button" variant="outline" className="mt-4">
                Select Image
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Supports: PNG, JPG, JPEG, WEBP (max 5MB)
              </p>
            </div>
          )}

          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
