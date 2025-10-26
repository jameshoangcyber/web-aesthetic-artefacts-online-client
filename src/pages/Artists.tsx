import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { artistService } from "@/services/artist.service";
import type { Artist } from "@/types";
import { toast } from "sonner";
import { Award } from "lucide-react";

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setIsLoading(true);
      const response = await artistService.getArtists({ limit: 100 });
      setArtists(response.data);
    } catch (error) {
      console.error("Failed to load artists:", error);
      toast.error("Không thể tải danh sách nghệ sĩ");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold mb-4">Nghệ sĩ của chúng tôi</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gặp gỡ những nghệ sĩ tài năng đứng sau các tác phẩm nghệ thuật độc đáo
          </p>
        </div>

        {/* Artists Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-elegant bg-card rounded-2xl">
                <Skeleton className="aspect-square" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <Link to={`/artist/${artist._id}`} key={artist._id}>
                <Card className="overflow-hidden border-0 shadow-elegant hover:shadow-hover transition-slow bg-card h-full rounded-2xl">
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {artist.featured && (
                      <Badge className="absolute top-3 right-3 bg-accent">
                        Nổi bật
                      </Badge>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-serif font-bold">{artist.name}</h3>
                        {artist.verified && (
                          <Award className="h-5 w-5 text-accent" />
                        )}
                      </div>
                      <p className="text-sm text-accent uppercase tracking-wider">{artist.specialty}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">{artist.bio}</p>
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{artist.worksCount || 0}</span> tác phẩm
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Chưa có nghệ sĩ nào
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;
