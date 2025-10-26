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
  return (
    <Card className="group overflow-hidden border-0 shadow-elegant hover:shadow-hover transition-slow bg-card">
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-slow group-hover:scale-105"
            loading="lazy"
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
          <p className="text-xl font-serif font-semibold text-accent">{price}</p>
          <Button variant="elegant" size="sm">
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
