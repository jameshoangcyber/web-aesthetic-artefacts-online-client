import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === 'admin') {
      const from = (location.state as { from?: Location })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else if (!authLoading && isAuthenticated && user?.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang quản trị');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate, location, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      
      // Check if user is admin after login
      // The useEffect will handle the redirect
    } catch (error) {
      console.error('Login failed:', error);
      // Error toast is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <Card className="w-full max-w-md shadow-elegant rounded-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <img 
              src="/logo-dark.png" 
              alt="ArtGallery Admin" 
              className="h-24 sm:h-24 w-auto dark:hidden"
            />
            <img 
              src="/logo-light.png" 
              alt="ArtGallery Admin" 
              className="h-20 sm:h-24 w-auto hidden dark:block"
            />
          </div>
          <CardTitle className="text-3xl font-serif">Admin Portal</CardTitle>
          <CardDescription className="text-base">
            Đăng nhập vào hệ thống quản trị
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@artgallery.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Mật khẩu
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Đăng nhập quản trị
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Tài khoản quản trị viên được cấp bởi hệ thống</p>
            <Link to="/" className="text-accent hover:underline inline-block mt-2">
              ← Quay về trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

