import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService } from '@/services/cart.service';
import { useAuth } from './AuthContext';
import type { Cart, CartItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  totalPrice: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const userCart = await cartService.getCart();
      setCart(userCart);
    } catch (error: any) {
      // If cart doesn't exist, that's okay (empty cart)
      if (error.response?.status !== 404) {
        console.error('Failed to load cart:', error);
      }
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }

    try {
      const updatedCart = await cartService.addToCart(productId, quantity);
      setCart(updatedCart);
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      toast.error(message);
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập');
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const updatedCart = await cartService.updateCartItem(productId, quantity);
      setCart(updatedCart);
      toast.success('Đã cập nhật giỏ hàng');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể cập nhật giỏ hàng';
      toast.error(message);
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập');
      return;
    }

    try {
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      toast.success('Đã xóa khỏi giỏ hàng');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể xóa khỏi giỏ hàng';
      toast.error(message);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await cartService.clearCart();
      setCart(null);
      toast.success('Đã xóa toàn bộ giỏ hàng');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Không thể xóa giỏ hàng';
      toast.error(message);
      throw error;
    }
  };

  const refreshCart = async () => {
    if (isAuthenticated) {
      await loadCart();
    }
  };

  const itemCount = cart?.totalItems || 0;
  const totalPrice = cart?.totalPrice || 0;

  const value: CartContextType = {
    cart,
    isLoading,
    itemCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

