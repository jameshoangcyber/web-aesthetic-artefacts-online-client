export interface Product {
  id: string;
  title: string;
  artist: string;
  price: string;
  priceValue: number;
  image: string;
  category: string;
  description: string;
  dimensions: string;
  material: string;
  year: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Sự trừu tượng của ánh sáng",
    artist: "Nguyễn Văn A",
    price: "15.000.000 ₫",
    priceValue: 15000000,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
    category: "Tranh vẽ",
    description: "Một tác phẩm trừu tượng đầy màu sắc thể hiện sự giao thoa giữa ánh sáng và bóng tối, tạo nên một không gian nghệ thuật đầy cảm xúc.",
    dimensions: "100 x 120 cm",
    material: "Sơn dầu trên canvas",
    year: "2023"
  },
  {
    id: "2",
    title: "Thiên nhiên hoang dại",
    artist: "Trần Thị B",
    price: "8.500.000 ₫",
    priceValue: 8500000,
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
    category: "Ảnh nghệ thuật",
    description: "Bức ảnh nghệ thuật chụp vẻ đẹp của thiên nhiên hoang dại, in trên giấy cao cấp với khung gỗ tự nhiên.",
    dimensions: "60 x 90 cm",
    material: "In nghệ thuật trên giấy Fine Art",
    year: "2023"
  },
  {
    id: "3",
    title: "Tượng người phụ nữ",
    artist: "Lê Văn C",
    price: "25.000.000 ₫",
    priceValue: 25000000,
    image: "https://images.unsplash.com/photo-1578926375605-eaf9ce0dc1e6?w=800&q=80",
    category: "Điêu khắc",
    description: "Tác phẩm điêu khắc đồng thau thể hiện vẻ đẹp và sức mạnh của người phụ nữ hiện đại.",
    dimensions: "45 x 25 x 20 cm",
    material: "Đồng thau",
    year: "2022"
  },
  {
    id: "4",
    title: "Phong cảnh mùa thu",
    artist: "Phạm Thị D",
    price: "12.000.000 ₫",
    priceValue: 12000000,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    category: "Tranh vẽ",
    description: "Bức tranh phong cảnh mùa thu với những sắc màu ấm áp, thể hiện vẻ đẹp của thiên nhiên Việt Nam.",
    dimensions: "80 x 100 cm",
    material: "Acrylic trên canvas",
    year: "2023"
  },
  {
    id: "5",
    title: "Đèn trang trí nghệ thuật",
    artist: "Hoàng Văn E",
    price: "5.500.000 ₫",
    priceValue: 5500000,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
    category: "Đồ trang trí",
    description: "Đèn trang trí handmade với thiết kế độc đáo, phù hợp cho không gian hiện đại.",
    dimensions: "30 x 30 x 40 cm",
    material: "Kim loại và vải thủ công",
    year: "2023"
  },
  {
    id: "6",
    title: "Cảnh đô thị về đêm",
    artist: "Đỗ Văn F",
    price: "18.000.000 ₫",
    priceValue: 18000000,
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80",
    category: "Tranh vẽ",
    description: "Bức tranh thể hiện vẻ đẹp lung linh của thành phố về đêm với những ánh đèn rực rỡ.",
    dimensions: "120 x 80 cm",
    material: "Sơn dầu trên canvas",
    year: "2023"
  }
];

export const categories = [
  "Tất cả",
  "Tranh vẽ",
  "Ảnh nghệ thuật",
  "Điêu khắc",
  "Đồ trang trí"
];
