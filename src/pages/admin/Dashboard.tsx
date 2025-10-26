import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';
import StatCard from '@/components/admin/StatCard';
import { Users, Palette, ShoppingBag, Package, DollarSign, Loader2, FolderTree, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const Dashboard = () => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: AdminService.getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Không thể tải dữ liệu dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Tổng quan hệ thống và các chỉ số quan trọng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          description="Tài khoản đã đăng ký"
          icon={Users}
        />
        <StatCard
          title="Tổng nghệ sĩ"
          value={stats.totalArtists}
          description="Nghệ sĩ hoạt động"
          icon={Palette}
        />
        <StatCard
          title="Tổng sản phẩm"
          value={stats.totalProducts}
          description="Sản phẩm trong kho"
          icon={ShoppingBag}
        />
        <StatCard
          title="Danh mục"
          value={stats.totalCategories}
          description="Danh mục sản phẩm"
          icon={FolderTree}
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          description="Đơn hàng đã tạo"
          icon={Package}
        />
        <StatCard
          title="Tổng doanh thu"
          value={formatCurrency(stats.totalRevenue)}
          description="Doanh thu tích lũy"
          icon={TrendingUp}
        />
      </div>

      {/* Recent Orders */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <CardDescription>5 đơn hàng mới nhất trong hệ thống</CardDescription>
            </div>
            <Link to="/admin/orders">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                Xem tất cả
              </Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Chưa có đơn hàng nào</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-secondary/30 -mx-2 px-2 py-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <Link
                      to={`/order/${order._id}`}
                      className="font-medium font-mono hover:text-accent transition-colors"
                    >
                      #{order.orderNumber}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-semibold text-accent">{formatCurrency(order.totalAmount)}</p>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold font-serif mb-4">Thao tác nhanh</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/users">
            <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer rounded-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-base">Người dùng</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quản lý tài khoản và phân quyền
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/artists">
            <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer rounded-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Palette className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-base">Nghệ sĩ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Thêm và chỉnh sửa hồ sơ nghệ sĩ
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/products">
            <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer rounded-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <ShoppingBag className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-base">Sản phẩm</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quản lý kho sản phẩm nghệ thuật
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/categories">
            <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer rounded-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <FolderTree className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-base">Danh mục</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quản lý danh mục sản phẩm
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/orders">
            <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer rounded-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Package className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-base">Đơn hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Theo dõi và xử lý đơn hàng
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

