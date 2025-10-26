import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  title: string;
  artist: string;
  price: string;
  image: string;
  category: string;
}

const ProductCard = ({ id, title, artist, price, image, category }: ProductCardProps) => {
  const safeImage = image || '/placeholder.svg';
  const safePrice = price || '0 VND';
  
  return (
    <Card className="group overflow-hidden border-0 shadow-elegant hover:shadow-hover transition-slow bg-card rounded-2xl">
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={safeImage}
            alt={title}
            className="w-full h-full object-cover transition-slow group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
      </Link>
      <div className="p-6 space-y-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{category}</p>
          <Link to={`/product/${id}`}>
            <h3 className="font-serif text-lg font-medium transition-smooth hover:text-accent">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{artist}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="text-xl font-serif font-semibold text-accent">{safePrice}</p>
          <Button variant="elegant" size="sm" asChild>
            <Link to={`/product/${id}`}>
              Xem chi tiết
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
