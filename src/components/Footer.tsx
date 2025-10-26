import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold">ArtGallery</h3>
            <p className="text-muted-foreground">
              Nơi gặp gỡ giữa nghệ thuật và cuộc sống
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent transition-smooth">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-accent transition-smooth">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-muted-foreground hover:text-accent transition-smooth">
                  Nghệ sĩ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-accent transition-smooth">
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-smooth">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-smooth">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-smooth">
                  Vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-smooth">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Email: info@artgallery.vn</li>
              <li>Điện thoại: 0123 456 789</li>
              <li>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 ArtGallery. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
