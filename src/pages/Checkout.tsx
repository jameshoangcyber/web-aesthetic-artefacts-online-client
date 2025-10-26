import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Giỏ hàng trống");
      navigate("/products");
      return;
    }

    // Pre-fill user data if available
    if (user) {
      setFormData({
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.phone || "",
        street: user.address?.street || "",
        ward: user.address?.ward || "",
        district: user.address?.district || "",
        city: user.address?.city || "",
        notes: "",
      });
    }
  }, [isAuthenticated, cart, user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.street.trim()) newErrors.street = "Vui lòng nhập địa chỉ";
    if (!formData.ward.trim()) newErrors.ward = "Vui lòng nhập phường/xã";
    if (!formData.district.trim()) newErrors.district = "Vui lòng nhập quận/huyện";
    if (!formData.city.trim()) newErrors.city = "Vui lòng nhập thành phố";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !cart) {
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
        },
        paymentMethod,
        notes: formData.notes || undefined,
      };

      const order = await orderService.createOrder(orderData);

      // Refresh cart (backend already cleared it)
      await refreshCart();

      toast.success("Đặt hàng thành công!", {
        description: `Mã đơn hàng: ${order.orderNumber}`,
        icon: <CheckCircle2 className="h-5 w-5" />,
      });

      // Navigate to order success page
      navigate(`/order/${order._id}`);
    } catch (error) {
      console.error("Checkout failed:", error);
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Đặt hàng thất bại";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const shippingFee = totalPrice >= 5000000 ? 0 : 50000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="min-h-screen py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <h1 className="text-4xl font-serif font-bold mb-8 text-center">
          Thanh toán
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="border-0 shadow-elegant rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Địa chỉ *</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Số nhà, tên đường"
                      disabled={isLoading}
                    />
                    {errors.street && (
                      <p className="text-xs text-red-500">{errors.street}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã *</Label>
                      <Input
                        id="ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.ward && (
                        <p className="text-xs text-red-500">{errors.ward}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện *</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.district && (
                        <p className="text-xs text-red-500">{errors.district}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Thành phố *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.city && (
                        <p className="text-xs text-red-500">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Ghi chú cho đơn hàng..."
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-0 shadow-elegant rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as 'cod' | 'stripe')}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-smooth">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-muted-foreground">
                            Thanh toán bằng tiền mặt khi nhận hàng
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-smooth">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium">Thanh toán trực tuyến</div>
                          <div className="text-sm text-muted-foreground">
                            Thanh toán qua thẻ tín dụng/ghi nợ
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-elegant sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">
                    Đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.items.filter(item => item.product).map((item) => {
                      const imageUrl = item.product?.images?.[0] || '/placeholder.svg';
                      const title = item.product?.title || 'Sản phẩm không tồn tại';
                      
                      return (
                        <div key={item.productId} className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={imageUrl}
                              alt={title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">
                              {title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              x{item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-accent">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* Price Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span className="font-medium">
                        {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                      </span>
                    </div>
                    {shippingFee === 0 && (
                      <p className="text-xs text-green-600">
                        🎉 Miễn phí vận chuyển cho đơn hàng trên 5 triệu
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Tổng cộng</span>
                    <span className="text-2xl font-bold font-serif text-accent">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  <Button 
                    type="submit" 
                    variant="gold" 
                    size="lg" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Đặt hàng"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Bằng cách đặt hàng, bạn đồng ý với{" "}
                    <a href="/terms" className="text-accent hover:underline">
                      Điều khoản dịch vụ
                    </a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

