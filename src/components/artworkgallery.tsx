import { useEffect, useState, useRef, useCallback } from "react";
import { Blurhash } from "react-blurhash";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface Artwork {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  artistID: string;
  createdAt: any;
  blurhash?: string;
  price?: number;
}

export function ArtworkGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cartItems, setCartItems] = useState<Artwork[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  const addToCart = (artwork: Artwork) => {
    setCartItems((prev) => [...prev, artwork]);
    toast.success("Added to cart", {
      description: `${artwork.title} has been added to your cart`,
      action: {
        label: "View Cart",
        onClick: () => console.log("Navigate to cart"),
      },
    });
  };

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Art Gallery</h2>
        <div className="relative">
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
      </div>

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
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium line-clamp-1">
                      {art.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {art.description}
                    </CardDescription>
                    {art.price && (
                      <p className="text-sm font-semibold mt-2">${art.price}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-2"
                    onClick={() => addToCart(art)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
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
