import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Loader2, MoreHorizontal, Search, Plus } from 'lucide-react';
import { useState } from 'react';

const ArtistsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: artists, isLoading, isError } = useQuery({
    queryKey: ['adminArtists'],
    queryFn: AdminService.getAllArtists,
  });

  const filteredArtists = artists?.filter((artist) =>
    `${artist.name} ${artist.specialty} ${artist.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
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
        <p className="text-destructive">Không thể tải danh sách nghệ sĩ</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Quản lý nghệ sĩ</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin nghệ sĩ trong hệ thống
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nghệ sĩ
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm nghệ sĩ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableCaption>Danh sách nghệ sĩ trong hệ thống</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nghệ sĩ</TableHead>
              <TableHead>Chuyên môn</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Số tác phẩm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[80px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArtists && filteredArtists.length > 0 ? (
              filteredArtists.map((artist) => (
                <TableRow key={artist._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={artist.avatar} alt={artist.name} />
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {getInitials(artist.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{artist.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{artist.specialty}</Badge>
                  </TableCell>
                  <TableCell>{artist.email || '—'}</TableCell>
                  <TableCell>{artist.phone || '—'}</TableCell>
                  <TableCell>{artist.worksCount || 0} tác phẩm</TableCell>
                  <TableCell>
                    {artist.isActive ? (
                      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                    ) : (
                      <Badge variant="secondary">Ngừng hoạt động</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(artist.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
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
                        <DropdownMenuItem>Xem tác phẩm</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Không tìm thấy nghệ sĩ nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ArtistsManagement;

