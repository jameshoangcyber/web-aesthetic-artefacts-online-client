import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';
import { Category } from '@/types';
import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2,
  Package,
  Image as ImageIcon,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'sonner';

const CategoriesManagement = () => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: '',
    order: 0,
    isActive: true,
  });
  
  const queryClient = useQueryClient();

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: AdminService.getAllCategories,
  });

  const createMutation = useMutation({
    mutationFn: AdminService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('Tạo danh mục thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tạo danh mục thất bại');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      AdminService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      toast.success('Cập nhật danh mục thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cập nhật danh mục thất bại');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: AdminService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      setDeletingCategory(null);
      toast.success('Xóa danh mục thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xóa danh mục thất bại');
    },
  });

  const updateCountsMutation = useMutation({
    mutationFn: AdminService.updateCategoryCounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      toast.success('Cập nhật số lượng sản phẩm thành công');
    },
    onError: () => {
      toast.error('Cập nhật số lượng sản phẩm thất bại');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      icon: '',
      order: 0,
      isActive: true,
    });
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      icon: category.icon || '',
      order: category.order,
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

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
        <p className="text-destructive">Không thể tải danh sách danh mục</p>
      </div>
    );
  }

  const sortedCategories = [...(categories || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Quản lý danh mục</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý danh mục sản phẩm
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => updateCountsMutation.mutate()}
            disabled={updateCountsMutation.isPending}
          >
            {updateCountsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Cập nhật số lượng
              </>
            )}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory
                      ? 'Cập nhật thông tin danh mục'
                      : 'Điền thông tin danh mục mới'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên danh mục *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="VD: Tranh vẽ"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Mô tả về danh mục..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL Hình ảnh</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Lucide name)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      placeholder="VD: Palette, Camera, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Thứ tự hiển thị</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                      }
                      min="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor="isActive">Kích hoạt</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : editingCategory ? (
                      'Cập nhật'
                    ) : (
                      'Tạo mới'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableCaption>
            Danh sách {sortedCategories.length} danh mục trong hệ thống
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Thứ tự</TableHead>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-[100px]">Hình ảnh</TableHead>
              <TableHead className="w-[120px]">Sản phẩm</TableHead>
              <TableHead className="w-[100px]">Trạng thái</TableHead>
              <TableHead className="w-[150px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-mono text-center">
                    {category.order}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        slug: {category.slug}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{category.productCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Kích hoạt' : 'Tạm dừng'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditDialog(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingCategory(category)}
                        disabled={category.productCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Chưa có danh mục nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{deletingCategory?.name}"? Hành động này không thể hoàn tác.
              {deletingCategory && deletingCategory.productCount > 0 && (
                <p className="mt-2 text-destructive font-semibold">
                  Không thể xóa danh mục có {deletingCategory.productCount} sản phẩm.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCategory && deleteMutation.mutate(deletingCategory._id)}
              disabled={deleteMutation.isPending || (deletingCategory?.productCount || 0) > 0}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriesManagement;

