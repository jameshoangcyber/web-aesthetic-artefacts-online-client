import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Về ArtGallery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nơi gặp gỡ giữa nghệ thuật và cuộc sống
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-6">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                ArtGallery ra đời từ niềm đam mê với nghệ thuật và mong muốn kết nối các nghệ sĩ tài năng 
                với những người yêu thích nghệ thuật trên khắp Việt Nam.
              </p>
              <p>
                Chúng tôi tin rằng mỗi tác phẩm nghệ thuật đều mang trong mình một câu chuyện, một cảm xúc 
                riêng biệt. Sứ mệnh của chúng tôi là giúp những câu chuyện đó được kể, được lắng nghe và 
                được trân trọng trong từng không gian sống.
              </p>
              <p>
                Với đội ngũ các nghệ sĩ đa dạng, từ hội họa, nhiếp ảnh, điêu khắc đến thiết kế đồ trang trí, 
                chúng tôi mang đến cho bạn một bộ sưu tập phong phú, độc đáo và chất lượng cao.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8 pt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Chất lượng</h3>
              <p className="text-muted-foreground">
                Mỗi tác phẩm được tuyển chọn kỹ lưỡng từ các nghệ sĩ tài năng
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Độc đáo</h3>
              <p className="text-muted-foreground">
                Những tác phẩm nghệ thuật không đâu có, chỉ có tại ArtGallery
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">Tận tâm</h3>
              <p className="text-muted-foreground">
                Đồng hành cùng bạn từ lựa chọn đến khi tác phẩm về tay
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-12">
            <h3 className="text-3xl font-serif font-bold mb-6">
              Sẵn sàng khám phá nghệ thuật?
            </h3>
            <Link to="/products">
              <Button variant="gold" size="lg">
                Khám phá bộ sưu tập
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
