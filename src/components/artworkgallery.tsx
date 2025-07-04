import { useEffect, useState } from "react";

interface Artwork {
  id: string;
  title: string;
  description?: string;
  imageUrl: string; // Use camelCase to match Go struct if needed
  artistID: string;
  createdAt: any;
}

export function ArtworkGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await fetch("http://localhost:3001/artworks");
        const data = await res.json();
        console.log("Fetched artworks:", data);
        setArtworks(data);
      } catch (err) {
        console.error("Failed to fetch artworks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Art Gallery</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artworks.map((art) => (
            <div
              key={art.id}
              className="border rounded shadow-sm overflow-hidden"
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium">{art.title}</h3>
                <p className="text-sm text-gray-600">{art.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
