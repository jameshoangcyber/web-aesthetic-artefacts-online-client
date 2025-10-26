import { Link } from "react-router-dom";
import { User, LogOut, Settings, Package, Menu, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CartDrawer from "./CartDrawer";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo with dark mode support */}
            <img 
              src="/logo-dark.png" 
              alt="ArtGallery Studio" 
              className="h-20 sm:h-24 w-auto dark:hidden"
            />
            <img 
              src="/logo-light.png" 
              alt="ArtGallery Studio" 
              className="h-20 sm:h-24 w-auto hidden dark:block"
            />
          </Link>

          {/* Desktop Navigation */}
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <CartDrawer />

            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.firstName} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Tài khoản
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Đơn hàng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Cài đặt
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button variant="gold" asChild>
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="flex justify-center">
                    <img 
                      src="/logo-dark.png" 
                      alt="ArtGallery Studio" 
                      className="h-16 w-auto dark:hidden"
                    />
                    <img 
                      src="/logo-light.png" 
                      alt="ArtGallery Studio" 
                      className="h-16 w-auto hidden dark:block"
                    />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link 
                    to="/" 
                    className="text-lg font-medium transition-smooth hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Trang chủ
                  </Link>
                  <Link 
                    to="/products" 
                    className="text-lg font-medium transition-smooth hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sản phẩm
                  </Link>
                  <Link 
                    to="/artists" 
                    className="text-lg font-medium transition-smooth hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Nghệ sĩ
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-lg font-medium transition-smooth hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giới thiệu
                  </Link>
                  
                  {!isAuthenticated && (
                    <>
                      <hr className="my-4" />
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Đăng nhập
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="gold" className="w-full">
                          Đăng ký
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
