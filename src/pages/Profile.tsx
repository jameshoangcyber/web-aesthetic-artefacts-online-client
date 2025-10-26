import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Package,
  Edit,
  Loader2,
  Eye
} from "lucide-react";
import type { Order } from "@/types";
import { toast } from "sonner";

const Profile = () => {
  const { user, isAuthenticated, updateUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    city: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập");
      navigate("/login");
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
        street: user.address?.street || "",
        ward: user.address?.ward || "",
        district: user.address?.district || "",
        city: user.address?.city || "",
      });
      loadOrders();
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const loadOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await orderService.getOrders({ page: 1, limit: 10 });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdating(true);
    try {
      await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        address: formData.street ? {
          street: formData.street,
          ward: formData.ward,
          district: formData.district,
          city: formData.city,
        } : undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
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
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      processing: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-8">Tài khoản của tôi</h1>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="orders">
              Đơn hàng ({orders.length})
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="info">
            <Card className="border-0 shadow-elegant rounded-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-serif">Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Quản lý thông tin cá nhân và địa chỉ giao hàng
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Email:</span> {user.email}
                        {user.isEmailVerified && (
                          <Badge variant="outline" className="ml-2">Đã xác thực</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Vai trò:</span>{" "}
                        {user.role === 'user' && 'Khách hàng'}
                        {user.role === 'artist' && 'Nghệ sĩ'}
                        {user.role === 'admin' && 'Quản trị viên'}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Họ</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing || isUpdating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Tên</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing || isUpdating}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing || isUpdating}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" />
                      Địa chỉ giao hàng
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="street">Địa chỉ</Label>
                      <Input
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Số nhà, tên đường"
                        disabled={!isEditing || isUpdating}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ward">Phường/Xã</Label>
                        <Input
                          id="ward"
                          name="ward"
                          value={formData.ward}
                          onChange={handleChange}
                          disabled={!isEditing || isUpdating}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">Quận/Huyện</Label>
                        <Input
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          disabled={!isEditing || isUpdating}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">Thành phố</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing || isUpdating}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        variant="gold"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          "Lưu thay đổi"
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setFormData({
                              firstName: user.firstName,
                              lastName: user.lastName,
                              phone: user.phone || "",
                              street: user.address?.street || "",
                              ward: user.address?.ward || "",
                              district: user.address?.district || "",
                              city: user.address?.city || "",
                            });
                          }
                        }}
                        disabled={isUpdating}
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-elegant rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-serif flex items-center gap-2">
                  <Package className="h-6 w-6 text-accent" />
                  Đơn hàng của tôi
                </CardTitle>
                <CardDescription>
                  Theo dõi trạng thái đơn hàng và lịch sử mua sắm
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order._id}
                        className="p-4 border rounded-lg hover:bg-secondary/50 transition-smooth"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold">
                              Đơn hàng #{order.orderNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.orderStatus)}
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              • {item.product.title} x{item.quantity}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-sm text-muted-foreground">
                              ... và {order.items.length - 2} sản phẩm khác
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-accent">
                            {formatPrice(order.totalAmount)}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/order/${order._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Bắt đầu mua sắm để tạo đơn hàng đầu tiên
                    </p>
                    <Button variant="gold" asChild>
                      <Link to="/products">
                        Khám phá sản phẩm
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

