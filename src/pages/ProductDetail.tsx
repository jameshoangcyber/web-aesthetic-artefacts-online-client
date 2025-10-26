import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { productService } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Eye,
  Ruler,
  Calendar,
  Package,
  Loader2
} from "lucide-react";
import type { Product } from "@/types";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProductById(id!);
      setProduct(data);
      // Increment view count
      productService.incrementViews(id!).catch(console.error);
    } catch (error) {
      console.error("Failed to load product:", error);
      toast.error("Không thể tải thông tin sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Không tìm thấy sản phẩm</h2>
          <Button onClick={() => navigate("/products")} variant="gold">
            Xem tất cả sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage] || images[0] || "";

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-smooth ${
                      selectedImage === index 
                        ? "border-accent" 
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-serif font-bold mb-2">
                {product.title}
              </h1>
              <Link 
                to={`/artist/${product.artistId}`}
                className="text-lg text-accent hover:underline"
              >
                {product.artistName}
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{product.views} lượt xem</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{product.likes} yêu thích</span>
              </div>
            </div>

            <Separator />

            <div className="text-3xl font-serif font-bold text-accent">
              {product.price}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Kích thước:</span>{" "}
                  {product.dimensions.width} x {product.dimensions.height}
                  {product.dimensions.depth && ` x ${product.dimensions.depth}`} {product.dimensions.unit}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Chất liệu:</span> {product.material}
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Năm sáng tác:</span> {product.year}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Mô tả</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              {product.isAvailable && product.stock > 0 ? (
                <>
                  <Button 
                    variant="gold" 
                    size="lg" 
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Đang thêm...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Thêm vào giỏ hàng
                      </>
                    )}
                  </Button>
                  <div className="text-sm text-center text-muted-foreground">
                    Còn {product.stock} sản phẩm trong kho
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Badge variant="destructive" className="text-base px-4 py-2">
                    Hết hàng
                  </Badge>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Yêu thích
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="mr-2 h-5 w-5" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center border-0 shadow-elegant rounded-2xl">
            <Package className="h-8 w-8 mx-auto mb-3 text-accent" />
            <h3 className="font-semibold mb-2">Giao hàng toàn quốc</h3>
            <p className="text-sm text-muted-foreground">
              Miễn phí vận chuyển cho đơn hàng trên 5 triệu
            </p>
          </Card>

          <Card className="p-6 text-center border-0 shadow-elegant rounded-2xl">
            <Eye className="h-8 w-8 mx-auto mb-3 text-accent" />
            <h3 className="font-semibold mb-2">Xem trước thực tế</h3>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ xem trước tác phẩm tại không gian của bạn
            </p>
          </Card>

          <Card className="p-6 text-center border-0 shadow-elegant rounded-2xl">
            <Heart className="h-8 w-8 mx-auto mb-3 text-accent" />
            <h3 className="font-semibold mb-2">Cam kết chính hãng</h3>
            <p className="text-sm text-muted-foreground">
              100% tác phẩm nghệ thuật nguyên bản
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

