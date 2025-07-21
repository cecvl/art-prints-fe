import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ProfileFormProps {
  defaultValues?: {
    name?: string;
    description?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    backgroundUrl?: string;
  };
}

export default function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [description, setDescription] = useState(
    defaultValues?.description || ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    defaultValues?.dateOfBirth || ""
  );
  const [avatar, setAvatar] = useState<File | null>(null);
  const [background, setBackground] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [previewAvatar, setPreviewAvatar] = useState<string | null>(
    defaultValues?.avatarUrl || null
  );
  const [previewBackground, setPreviewBackground] = useState<string | null>(
    defaultValues?.backgroundUrl || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("dateOfBirth", dateOfBirth);
    if (avatar) formData.append("avatar", avatar);
    if (background) formData.append("background", background);

    console.log("📨 Submitting form data...");

    try {
      const res = await fetch("http://localhost:3001/updateprofile", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Profile updated ✅");
    } catch (err: any) {
      toast.error("Failed to update profile: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-6 p-6 bg-white rounded-xl shadow"
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Avatar</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatar(file);
                setPreviewAvatar(URL.createObjectURL(file));
              }
            }}
          />
          {previewAvatar && (
            <img
              src={previewAvatar}
              alt="Avatar Preview"
              className="mt-2 h-20 rounded-full"
            />
          )}
        </div>

        <div>
          <Label>Background</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setBackground(file);
                setPreviewBackground(URL.createObjectURL(file));
              }
            }}
          />
          {previewBackground && (
            <img
              src={previewBackground}
              alt="Background Preview"
              className="mt-2 h-20 w-full object-cover rounded"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}
