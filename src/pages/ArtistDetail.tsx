import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { artistService } from "@/services/artist.service";
import { productService } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { 
  ArrowLeft, 
  MapPin, 
  Award,
  Palette,
  ExternalLink,
  Instagram,
  Facebook,
  Globe
} from "lucide-react";
import type { Artist, Product } from "@/types";
import { toast } from "sonner";

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    if (id) {
      loadArtist();
      loadProducts();
    }
  }, [id]);

  const loadArtist = async () => {
    try {
      setIsLoading(true);
      const data = await artistService.getArtistById(id!);
      setArtist(data);
    } catch (error) {
      console.error("Failed to load artist:", error);
      toast.error("Không thể tải thông tin nghệ sĩ");
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await productService.getProductsByArtist(id!);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Không tìm thấy nghệ sĩ</h2>
          <Button onClick={() => navigate("/artists")} variant="gold">
            Xem tất cả nghệ sĩ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Cover Image */}
      {artist.coverImage && (
        <div className="h-64 lg:h-96 relative overflow-hidden bg-muted">
          <img
            src={artist.coverImage}
            alt={`${artist.name} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        {/* Artist Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Avatar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted shadow-elegant">
              <img
                src={artist.avatar}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Social Links */}
            {artist.socialLinks && (
              <div className="mt-6 space-y-3">
                {artist.socialLinks.website && (
                  <a
                    href={artist.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-accent transition-smooth"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {artist.socialLinks.instagram && (
                  <a
                    href={artist.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-accent transition-smooth"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {artist.socialLinks.facebook && (
                  <a
                    href={artist.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-accent transition-smooth"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-serif font-bold">{artist.name}</h1>
                {artist.verified && (
                  <Badge variant="default" className="bg-accent">
                    <Award className="mr-1 h-3 w-3" />
                    Đã xác thực
                  </Badge>
                )}
                {artist.featured && (
                  <Badge variant="secondary">
                    Nổi bật
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-lg text-accent">
                <Palette className="h-5 w-5" />
                <span>{artist.specialty}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-2xl font-bold font-serif">{artist.totalProducts}</div>
                <div className="text-sm text-muted-foreground">Tác phẩm</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-2xl font-bold font-serif">{artist.totalSales}</div>
                <div className="text-sm text-muted-foreground">Đã bán</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <div className="text-2xl font-bold font-serif">{artist.rating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Đánh giá</div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-serif font-bold mb-4">Về nghệ sĩ</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {artist.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Artist's Products */}
        <Separator className="mb-12" />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">
              Tất cả ({products.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Còn hàng
            </TabsTrigger>
            <TabsTrigger value="sold">
              Đã bán
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    id={product._id}
                    title={product.title}
                    artist={product.artistName}
                    price={product.price}
                    image={product.images[0]}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Chưa có tác phẩm nào
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="available">
            {products.filter(p => p.isAvailable && p.stock > 0).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.filter(p => p.isAvailable && p.stock > 0).map((product) => (
                  <ProductCard 
                    key={product._id} 
                    id={product._id}
                    title={product.title}
                    artist={product.artistName}
                    price={product.price}
                    image={product.images[0]}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Không có sản phẩm còn hàng
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            {products.filter(p => !p.isAvailable || p.stock === 0).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.filter(p => !p.isAvailable || p.stock === 0).map((product) => (
                  <ProductCard 
                    key={product._id} 
                    id={product._id}
                    title={product.title}
                    artist={product.artistName}
                    price={product.price}
                    image={product.images[0]}
                    category={product.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  Chưa có sản phẩm đã bán
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtistDetail;

