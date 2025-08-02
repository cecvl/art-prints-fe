import { useEffect, useState, useRef, useCallback } from "react";
import { Blurhash } from "react-blurhash";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Artwork {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  artistID: string;
  createdAt: any;
  blurhash?: string;
}

export function ArtworkGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastArtworkRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchArtworks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/artworks?page=${page}`);
      const data = await res.json();
      setArtworks((prev) => [...prev, ...data]);
      setHasMore(data.length > 0);
    } catch (err) {
      console.error("Failed to fetch artworks:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Art Gallery</h2>

      {/* Responsive grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {artworks.map((art, idx) => {
          const isLast = idx === artworks.length - 1;
          return (
            <Card
              key={art.id}
              ref={isLast ? lastArtworkRef : null}
              className="hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
                {art.blurhash ? (
                  <Blurhash
                    hash={art.blurhash}
                    width="100%"
                    height="100%"
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                  />
                ) : (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{
                    opacity: art.blurhash ? 0 : 1,
                  }}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = "1";
                  }}
                />
              </div>
              <CardContent className="p-3">
                <CardTitle className="text-sm font-medium line-clamp-1">
                  {art.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {art.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="w-full aspect-square rounded-t-lg" />
              <CardContent className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More button */}
      {!loading && hasMore && artworks.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
            className="px-8 py-4"
          >
            Load More Artworks
          </Button>
        </div>
      )}

      {!loading && !hasMore && artworks.length > 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          You've reached the end of the gallery
        </p>
      )}
    </div>
  );
}
