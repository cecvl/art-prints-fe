import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  price?: number;
}

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  description?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  roles: string[];
  artworks: Artwork[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:3001/getprofile", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setProfile({
        uid: data.user?.uid || "",
        name: data.user?.name || "Unknown Artist",
        email: data.user?.email || "",
        description: data.user?.description,
        avatarUrl: data.user?.avatarUrl,
        backgroundUrl: data.user?.backgroundUrl,
        roles: data.user?.roles || [],
        artworks:
          data.artworks?.map((art: any) => ({
            id: art.id,
            title: art.title || "Untitled",
            imageUrl: art.imageUrl || "",
            createdAt: art.createdAt || new Date().toISOString(),
            price: art.price,
          })) || [],
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="text-destructive mb-4">{error}</div>
        <Button onClick={fetchProfile}>Retry</Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        No profile data available
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Artworks Section */}
      <ArtworksSection artworks={profile.artworks} />
    </div>
  );
}

// Sub-components for better organization
const ProfileHeader = ({ profile }: { profile: UserProfile }) => (
  <div className="relative mb-16">
    {/* Background Image */}
    <div className="h-48 md:h-64 rounded-lg overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300">
      {profile.backgroundUrl && (
        <img
          src={profile.backgroundUrl}
          alt="Profile background"
          className="w-full h-full object-cover"
        />
      )}
    </div>

    {/* Avatar */}
    <div className="absolute -bottom-12 left-4">
      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background">
        {profile.avatarUrl ? (
          <AvatarImage src={profile.avatarUrl} />
        ) : (
          <AvatarFallback className="text-2xl bg-muted">
            {profile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  </div>
);

const ArtworksSection = ({ artworks }: { artworks: Artwork[] }) => (
  <section className="mt-12">
    <h2 className="text-xl font-semibold mb-4">
      {artworks.length ? "Artworks" : "No artworks yet"}
    </h2>

    {artworks.length ? (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-center py-8">
        This artist hasn't uploaded any artworks yet
      </p>
    )}
  </section>
);

const ArtworkCard = ({ artwork }: { artwork: Artwork }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow">
    <div className="aspect-square overflow-hidden">
      <img
        src={artwork.imageUrl || "/placeholder-artwork.jpg"}
        alt={artwork.title}
        className="w-full h-full object-cover hover:scale-105 transition-transform"
      />
    </div>
    <div className="p-3">
      <h3 className="font-medium truncate">{artwork.title}</h3>
      {artwork.price && (
        <p className="text-sm font-semibold mt-1">
          ${artwork.price.toFixed(2)}
        </p>
      )}
    </div>
  </Card>
);

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 space-y-6">
    <Skeleton className="w-full h-48 rounded-lg" />
    <div className="flex gap-4 items-start relative -mt-16 ml-4">
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  </div>
);
