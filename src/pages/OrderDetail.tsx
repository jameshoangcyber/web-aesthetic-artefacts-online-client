import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Package,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle
} from "lucide-react";
import type { Order } from "@/types";
import { toast } from "sonner";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }

    if (id) {
      loadOrder();
    }
  }, [id, isAuthenticated]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrderById(id!);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
      toast.error("Không thể tải thông tin đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      processing: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };

    return (
      <Badge variant={variants[status] || "outline"} className="text-base px-3 py-1">
        {labels[status] || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      paid: "default",
      failed: "destructive",
      refunded: "outline",
    };

    const labels: Record<string, string> = {
      pending: "Chưa thanh toán",
      paid: "Đã thanh toán",
      failed: "Thanh toán thất bại",
      refunded: "Đã hoàn tiền",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Không tìm thấy đơn hàng</h2>
          <Button onClick={() => navigate("/profile")} variant="gold">
            Quay lại tài khoản
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-serif font-bold">
              Đơn hàng #{order.orderNumber}
            </h1>
            {getStatusBadge(order.orderStatus)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Đặt hàng ngày {formatDate(order.createdAt)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="border-0 shadow-elegant rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <Package className="h-6 w-6 text-accent" />
                  Sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.filter(item => item.product).map((item, index) => {
                  const imageUrl = item.product?.images?.[0] || '/placeholder.svg';
                  const title = item.product?.title || 'Sản phẩm không tồn tại';
                  const artistName = item.product?.artistName || '';

                  return (
                    <div key={index}>
                      {index > 0 && <Separator />}
                      <div className="flex gap-4 py-4">
                        <Link 
                          to={`/product/${item.productId}`}
                          className="flex-shrink-0"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
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
                        </Link>

                        <div className="flex-1">
                          <Link 
                            to={`/product/${item.productId}`}
                            className="font-medium hover:text-accent transition-smooth"
                          >
                            {title}
                          </Link>
                          {artistName && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {artistName}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity}
                            </span>
                            <span className="font-semibold text-accent">
                              {formatPrice(item.subtotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="border-0 shadow-elegant rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-accent" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.street}, {order.shippingAddress.ward},{" "}
                  {order.shippingAddress.district}, {order.shippingAddress.city}
                </p>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="border-0 shadow-elegant rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-accent" />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phương thức</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thẻ tín dụng'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trạng thái</span>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
              </CardContent>
            </Card>

            {order.notes && (
              <Card className="border-0 shadow-elegant rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-elegant sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className="font-medium">
                      {order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="text-2xl font-bold font-serif text-accent">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Order Status Timeline */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm">Trạng thái đơn hàng</p>
                  
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${
                      ['pending', 'processing', 'shipped', 'delivered'].includes(order.orderStatus)
                        ? 'text-green-600' 
                        : 'text-muted-foreground'
                    }`}>
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Đã đặt hàng</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 ${
                      ['processing', 'shipped', 'delivered'].includes(order.orderStatus)
                        ? 'text-green-600' 
                        : 'text-muted-foreground'
                    }`}>
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Đang xử lý</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 ${
                      ['shipped', 'delivered'].includes(order.orderStatus)
                        ? 'text-green-600' 
                        : 'text-muted-foreground'
                    }`}>
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Đang giao hàng</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 ${
                      order.orderStatus === 'delivered'
                        ? 'text-green-600' 
                        : order.orderStatus === 'cancelled'
                        ? 'text-red-600'
                        : 'text-muted-foreground'
                    }`}>
                      {order.orderStatus === 'cancelled' ? (
                        <>
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Đã hủy</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Đã giao hàng</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {order.orderStatus === 'pending' && (
                  <>
                    <Separator />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={async () => {
                        try {
                          await orderService.cancelOrder(order._id);
                          toast.success("Đã hủy đơn hàng");
                          loadOrder();
                        } catch (error) {
                          toast.error("Không thể hủy đơn hàng");
                        }
                      }}
                    >
                      Hủy đơn hàng
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

