import { useEffect, useState } from "react";

interface UserProfile {
  name: string;
  description?: string;
  dateOfBirth: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  email: string;
  roles: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("http://localhost:3001/profile/view", {
        credentials: "include",
      });
      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {profile.backgroundUrl && (
        <img
          src={profile.backgroundUrl}
          alt="Background"
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
      )}

      <div className="flex gap-4 items-center">
        {profile.avatarUrl && (
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full border"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="text-sm">{profile.dateOfBirth}</p>
          <div className="mt-2 flex gap-2 text-xs">
            {profile.roles.map((role) => (
              <span
                key={role}
                className="bg-gray-200 px-2 py-1 rounded-md text-gray-800"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6">{profile.description}</p>
    </div>
  );
}
