import { useEffect, useState, useRef, useCallback } from "react";
import Masonry from "react-masonry-css";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Artwork {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  artistID: string;
  createdAt: any;
}

export function ArtworkGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastArtworkRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/artworks?page=${page}`);
        const data = await res.json();
        setArtworks((prev) => [...prev, ...data]);
      } catch (err) {
        console.error("Failed to fetch artworks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [page]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Art Gallery</h2>

      {/* 👇 Masonry layout for smaller screens */}
      <div className="block lg:hidden">
        <Masonry
          breakpointCols={{ default: 2, 500: 2 }}
          className="flex gap-4"
          columnClassName="flex flex-col gap-4"
        >
          {artworks.map((art, idx) => {
            const isLast = idx === artworks.length - 1;
            return (
              <Card
                key={art.id}
                ref={isLast ? lastArtworkRef : null}
                className="w-full"
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full rounded-t-xl"
                />
                <CardContent>
                  <CardTitle className="text-sm">{art.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {art.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </Masonry>
      </div>

      {/* 👇 Grid layout for larger screens */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
        {artworks.map((art, idx) => {
          const isLast = idx === artworks.length - 1;
          return (
            <Card
              key={art.id}
              ref={isLast ? lastArtworkRef : null}
              className="h-72 overflow-hidden"
            >
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <CardContent className="h-32 overflow-hidden">
                <CardTitle className="text-sm truncate">{art.title}</CardTitle>
                <CardDescription className="text-xs overflow-hidden text-ellipsis">
                  {art.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {loading && (
        <>
          {/* Skeletons for LG screens */}
          <div className="hidden lg:grid grid-cols-3 gap-6 mt-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-72">
                <Skeleton className="h-40 w-full rounded-t-xl" />
                <CardContent className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skeletons for smaller screens */}
          <div className="block lg:hidden mt-6">
            <Masonry
              breakpointCols={{ default: 2, 500: 2 }}
              className="flex gap-4"
              columnClassName="flex flex-col gap-4"
            >
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="w-full h-60">
                  <Skeleton className="h-36 w-full rounded-t-xl" />
                  <CardContent className="space-y-2 mt-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </CardContent>
                </Card>
              ))}
            </Masonry>
          </div>
        </>
      )}
    </div>
  );
}
