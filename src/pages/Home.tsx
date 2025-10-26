import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { productService } from "@/services/product.service";
import type { Product } from "@/types";
import heroImage from "@/assets/hero-art-gallery.jpg";
import { toast } from "sonner";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      const products = await productService.getFeaturedProducts(3);
      setFeaturedProducts(products);
    } catch (error) {
      console.error("Failed to load featured products:", error);
      toast.error("Không thể tải sản phẩm nổi bật");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
            Khám phá nghệ thuật
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bộ sưu tập độc đáo từ các nghệ sĩ tài năng
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/products">
              <Button variant="gold" size="lg" className="text-base">
                Khám phá bộ sưu tập
              </Button>
            </Link>
            <Link to="/artists">
              <Button variant="elegant" size="lg" className="text-base">
                Gặp gỡ nghệ sĩ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Tác phẩm nổi bật</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những tác phẩm nghệ thuật được tuyển chọn từ các nghệ sĩ hàng đầu
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                id={product._id}
                title={product.title}
                artist={product.artistName}
                price={product.price}
                image={product.images[0]}
                category={product.category}
              />
            ))
          )}
        </div>

        <div className="text-center">
          <Link to="/products">
            <Button variant="gold" size="lg">
              Xem tất cả sản phẩm
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold mb-4">Danh mục sản phẩm</h2>
            <p className="text-lg text-muted-foreground">
              Khám phá các loại hình nghệ thuật đa dạng
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Tranh vẽ", count: "15+" },
              { name: "Ảnh nghệ thuật", count: "20+" },
              { name: "Điêu khắc", count: "10+" },
              { name: "Đồ trang trí", count: "25+" }
            ].map((category) => (
              <Link
                key={category.name}
                to="/products"
                className="group p-8 bg-card rounded-2xl shadow-elegant hover:shadow-hover transition-smooth text-center"
              >
                <h3 className="text-2xl font-serif font-semibold mb-2 group-hover:text-accent transition-smooth">
                  {category.name}
                </h3>
                <p className="text-muted-foreground">{category.count} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Về ArtGallery</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Chúng tôi là nền tảng kết nối các nghệ sĩ tài năng với những người yêu nghệ thuật. 
            Mỗi tác phẩm đều mang trong mình một câu chuyện, một cảm xúc riêng biệt. 
            Hãy để chúng tôi giúp bạn tìm thấy tác phẩm nghệ thuật hoàn hảo cho không gian của mình.
          </p>
          <Link to="/about">
            <Button variant="elegant" size="lg">
              Tìm hiểu thêm
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
