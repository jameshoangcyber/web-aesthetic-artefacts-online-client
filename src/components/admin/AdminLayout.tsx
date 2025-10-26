import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Palette,
  ShoppingBag,
  FolderTree,
  Package,
  LogOut,
  Menu,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Người dùng', href: '/admin/users', icon: Users, end: false },
    { name: 'Nghệ sĩ', href: '/admin/artists', icon: Palette, end: false },
    { name: 'Sản phẩm', href: '/admin/products', icon: ShoppingBag, end: false },
    { name: 'Danh mục', href: '/admin/categories', icon: FolderTree, end: false },
    { name: 'Đơn hàng', href: '/admin/orders', icon: Package, end: false },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <img 
          src="/logo-dark.png" 
          alt="ArtGallery Admin" 
          className="h-14 w-auto dark:hidden"
        />
        <img 
          src="/logo-light.png" 
          alt="ArtGallery Admin" 
          className="h-14 w-auto hidden dark:block"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
        <div className="border-t my-2"></div>
        <NavLink
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5" />
          Về trang chủ
        </NavLink>
      </nav>

      {/* User Info & Logout */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
            {user?.firstName.charAt(0)}
            {user?.lastName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 lg:px-8">
          <div className="flex-1 lg:hidden">
            <img 
              src="/logo-dark.png" 
              alt="ArtGallery Admin" 
              className="h-16 w-auto dark:hidden"
            />
            <img 
              src="/logo-light.png" 
              alt="ArtGallery Admin" 
              className="h-12 w-auto hidden dark:block"
            />
          </div>
          <div className="flex-1 hidden lg:block">
            <h2 className="text-2xl font-semibold">Quản trị hệ thống</h2>
          </div>
          <ThemeToggle />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

