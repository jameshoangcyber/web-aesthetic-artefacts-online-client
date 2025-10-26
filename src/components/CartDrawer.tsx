import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const CartDrawer = () => {
  const { cart, itemCount, totalPrice, updateQuantity, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              variant="default"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">
            Giỏ hàng của bạn
          </SheetTitle>
          <SheetDescription>
            {itemCount > 0 ? `${itemCount} sản phẩm` : 'Giỏ hàng trống'}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {!cart || cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Giỏ hàng trống</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
            </p>
            <Button 
              variant="gold" 
              onClick={() => setOpen(false)}
              asChild
            >
              <Link to="/products">
                Khám phá sản phẩm
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3 pr-2">
                {cart.items.filter(item => item.product).map((item) => {
                  const product = item.product;
                  const imageUrl = product?.images?.[0] || '/placeholder.svg';
                  const title = product?.title || 'Sản phẩm không tồn tại';
                  const artistName = product?.artistName || '';
                  const stock = product?.stock || 0;

                  return (
                    <div 
                      key={item.productId} 
                      className="flex gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50"
                    >
                      <Link 
                        to={`/product/${item.productId}`}
                        onClick={() => setOpen(false)}
                        className="flex-shrink-0"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shadow-sm">
                          <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Link 
                            to={`/product/${item.productId}`}
                            onClick={() => setOpen(false)}
                            className="font-medium text-sm hover:text-accent transition-smooth line-clamp-2 block"
                          >
                            {title}
                          </Link>
                          {artistName && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {artistName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-accent">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <div className="flex items-center gap-1">
                            <div className="flex items-center border rounded-lg bg-background">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2 text-sm font-medium min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                disabled={item.quantity >= stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemove(item.productId)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <div className="space-y-4 pb-2">
              <div className="w-full space-y-3 px-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="text-xs">Tính khi thanh toán</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base">Tổng cộng</span>
                  <span className="text-xl font-bold font-serif text-accent">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="gold" 
                  size="lg" 
                  className="w-full"
                  onClick={() => setOpen(false)}
                  asChild
                >
                  <Link to="/checkout">
                    Thanh toán
                  </Link>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => setOpen(false)}
                  asChild
                >
                  <Link to="/products">
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

