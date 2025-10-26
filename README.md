# ArtGallery - Aesthetic Artefacts Online

Một website gallery nghệ thuật trực tuyến được xây dựng bằng React và TypeScript, tập trung vào việc trưng bày và bán các tác phẩm nghệ thuật từ các nghệ sĩ Việt Nam.

## Tính năng chính

- 🎨 Trưng bày các tác phẩm nghệ thuật đa dạng
- 🛒 Chức năng mua sắm trực tuyến
- 👨‍🎨 Giới thiệu các nghệ sĩ tài năng
- 📱 Responsive design cho mọi thiết bị
- 🌙 Hỗ trợ dark mode
- ⚡ Performance tối ưu với Vite

## Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **UI Components**: Radix UI + shadcn/ui

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm hoặc yarn

### Các bước cài đặt

```sh
# Clone repository
git clone <YOUR_GIT_URL>

# Di chuyển vào thư mục dự án
cd aesthetic-artefacts-online-main

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Các script có sẵn

```sh
# Development server
npm run dev

# Build production
npm run build

# Build development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Cấu trúc dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Thanh điều hướng
│   ├── Footer.tsx      # Footer
│   └── ProductCard.tsx # Card hiển thị sản phẩm
├── pages/              # Các trang chính
│   ├── Home.tsx        # Trang chủ
│   ├── Products.tsx    # Danh sách sản phẩm
│   ├── Artists.tsx     # Danh sách nghệ sĩ
│   ├── About.tsx       # Giới thiệu
│   └── NotFound.tsx    # Trang 404
├── data/               # Dữ liệu tĩnh
│   └── products.ts     # Danh sách sản phẩm
├── hooks/              # Custom hooks
├── lib/                # Utilities
└── assets/             # Hình ảnh
```

## Triển khai

Dự án có thể được triển khai trên các platform sau:

- **Vercel**: `npm run build` và deploy thư mục `dist`
- **Netlify**: Tương tự Vercel
- **GitHub Pages**: Sử dụng GitHub Actions
- **Docker**: Tạo Dockerfile cho containerization

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
