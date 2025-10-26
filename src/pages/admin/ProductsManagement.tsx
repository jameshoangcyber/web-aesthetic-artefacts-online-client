import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';
import { Product } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Loader2, MoreHorizontal, Search, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ProductsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: AdminService.getAllProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => AdminService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({
        title: 'Xóa sản phẩm thành công',
        description: 'Sản phẩm đã được xóa khỏi hệ thống.',
      });
      setProductToDelete(null);
    },
    onError: () => {
      toast({
        title: 'Xóa sản phẩm thất bại',
        description: 'Có lỗi xảy ra khi xóa sản phẩm.',
        variant: 'destructive',
      });
    },
  });

  const filteredProducts = products?.filter((product) =>
    `${product.title} ${product.artistName} ${product.category}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Không thể tải danh sách sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các sản phẩm nghệ thuật trong hệ thống
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableCaption>Danh sách sản phẩm trong hệ thống</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Nghệ sĩ</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Lượt xem</TableHead>
              <TableHead className="w-[80px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.artistName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{product.price}</TableCell>
                  <TableCell>
                    {product.stock > 0 ? (
                      <span>{product.stock} sản phẩm</span>
                    ) : (
                      <span className="text-destructive">Hết hàng</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.isAvailable ? (
                      <Badge className="bg-green-100 text-green-800">Đang bán</Badge>
                    ) : (
                      <Badge variant="secondary">Ngừng bán</Badge>
                    )}
                  </TableCell>
                  <TableCell>{product.views}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setProductToDelete(product)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Không tìm thấy sản phẩm nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.title}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && deleteProductMutation.mutate(productToDelete._id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsManagement;

