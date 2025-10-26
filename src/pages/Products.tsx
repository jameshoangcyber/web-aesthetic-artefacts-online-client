import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { productService } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import type { Product } from "@/types";
import { toast } from "sonner";

const categories = [
  "Tất cả",
  "Tranh vẽ",
  "Điêu khắc",
  "Nhiếp ảnh",
  "Đồ trang trí"
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const filters = selectedCategory === "Tất cả" 
          ? { limit: 100 }
          : { category: selectedCategory, limit: 100 };
        
        const response = await productService.getProducts(filters);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast.error("Không thể tải danh sách sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold mb-4">Bộ sưu tập nghệ thuật</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá những tác phẩm nghệ thuật độc đáo được tuyển chọn kỹ lưỡng
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "gold" : "elegant"}
              onClick={() => setSelectedCategory(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
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
              Không tìm thấy sản phẩm nào trong danh mục này
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
