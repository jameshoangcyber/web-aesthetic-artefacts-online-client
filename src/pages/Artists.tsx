import { Card } from "@/components/ui/card";

interface Artist {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  works: number;
}

const artists: Artist[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    specialty: "Hội họa trừu tượng",
    bio: "Nghệ sĩ với 15 năm kinh nghiệm trong lĩnh vực hội họa trừu tượng, từng triển lãm tại nhiều gallery trong và ngoài nước.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    works: 23
  },
  {
    id: "2",
    name: "Trần Thị B",
    specialty: "Nhiếp ảnh nghệ thuật",
    bio: "Chuyên chụp ảnh phong cảnh và thiên nhiên, đạt nhiều giải thưởng quốc tế về nhiếp ảnh nghệ thuật.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    works: 45
  },
  {
    id: "3",
    name: "Lê Văn C",
    specialty: "Điêu khắc đương đại",
    bio: "Nghệ sĩ điêu khắc với phong cách độc đáo, kết hợp giữa truyền thống và hiện đại.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    works: 18
  },
  {
    id: "4",
    name: "Phạm Thị D",
    specialty: "Hội họa phong cảnh",
    bio: "Chuyên vẽ tranh phong cảnh Việt Nam với kỹ thuật acrylic và sơn dầu, có hơn 20 năm kinh nghiệm.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    works: 67
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    specialty: "Thiết kế đồ trang trí",
    bio: "Nghệ nhân handmade với chuyên môn về các sản phẩm trang trí nội thất nghệ thuật.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    works: 34
  },
  {
    id: "6",
    name: "Đỗ Văn F",
    specialty: "Hội họa đô thị",
    bio: "Chuyên vẽ tranh về cuộc sống đô thị, nắm bắt những khoảnh khắc độc đáo của thành phố.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    works: 29
  }
];

const Artists = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold mb-4">Nghệ sĩ của chúng tôi</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gặp gỡ những nghệ sĩ tài năng đứng sau các tác phẩm nghệ thuật độc đáo
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <Card key={artist.id} className="overflow-hidden border-0 shadow-elegant hover:shadow-hover transition-slow bg-card">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-1">{artist.name}</h3>
                  <p className="text-sm text-accent uppercase tracking-wider">{artist.specialty}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{artist.works}</span> tác phẩm
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artists;
