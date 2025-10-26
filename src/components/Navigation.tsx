import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-serif font-bold tracking-tight">ArtGallery</h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium transition-smooth hover:text-accent">
              Trang chủ
            </Link>
            <Link to="/products" className="text-sm font-medium transition-smooth hover:text-accent">
              Sản phẩm
            </Link>
            <Link to="/artists" className="text-sm font-medium transition-smooth hover:text-accent">
              Nghệ sĩ
            </Link>
            <Link to="/about" className="text-sm font-medium transition-smooth hover:text-accent">
              Giới thiệu
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
