# 🎨 Theme Toggle & Scroll to Top - Hướng Dẫn

## ✅ Đã triển khai thành công

### 🌓 **Theme Toggle (Light/Dark Mode)**

#### Tính năng:
- ✅ Toggle giữa Light Mode / Dark Mode / System Mode
- ✅ Lưu preference vào `localStorage`
- ✅ Tự động theo system theme khi chọn "System"
- ✅ Smooth transitions giữa các modes
- ✅ Icons animate khi chuyển đổi

#### Vị trí hiển thị:
1. **Navigation Bar (Public pages)** - Bên trái giỏ hàng
2. **Admin Dashboard Header** - Góc phải header

#### Components đã tạo:

**1. ThemeContext (`src/contexts/ThemeContext.tsx`)**
```typescript
- ThemeProvider: Quản lý state theme toàn ứng dụng
- useTheme(): Hook để truy cập theme
- Lưu vào localStorage
- Listen system preference changes
```

**2. ThemeToggle (`src/components/ThemeToggle.tsx`)**
```typescript
- Dropdown menu với 3 options
- Sun/Moon icons với animations
- Checkmark cho active theme
```

---

### ⬆️ **Scroll to Top Button**

#### Tính năng:
- ✅ Xuất hiện khi scroll xuống > 300px
- ✅ Smooth scroll animation về đầu trang
- ✅ Fixed position ở góc phải dưới
- ✅ Hover animation (scale effect)
- ✅ Responsive trên mọi thiết bị

#### Component:

**ScrollToTop (`src/components/ScrollToTop.tsx`)**
```typescript
- Auto show/hide dựa trên scroll position
- Fixed position: bottom-8 right-8
- z-index: 50 (không chặn các elements khác)
- Smooth scroll behavior
```

---

## 🧪 Cách Test

### Theme Toggle:

1. **Test Light/Dark Mode:**
```
1. Click vào icon Sun/Moon trong navigation
2. Chọn "Light" → Page chuyển sang light mode
3. Chọn "Dark" → Page chuyển sang dark mode
4. Refresh page → Theme được giữ nguyên (localStorage)
```

2. **Test System Mode:**
```
1. Chọn "System" trong theme menu
2. Thay đổi system theme (Windows Settings → Colors → Dark/Light)
3. App tự động theo system theme
```

3. **Test trong Admin Dashboard:**
```
1. Login vào /admin/login
2. Click theme toggle ở header admin
3. Theme áp dụng cho cả admin layout
```

### Scroll to Top:

```
1. Vào bất kỳ trang nào (Home, Products, Artists, etc.)
2. Scroll xuống > 300px
3. Button "⬆" xuất hiện ở góc phải dưới
4. Click button → Smooth scroll về đầu trang
5. Scroll lên top → Button tự động ẩn
```

---

## 📁 Files đã cập nhật

```
web-aesthetic-artefacts-online-client/
├── src/
│   ├── contexts/
│   │   └── ThemeContext.tsx              ✅ NEW
│   ├── components/
│   │   ├── ThemeToggle.tsx               ✅ NEW
│   │   ├── ScrollToTop.tsx               ✅ NEW
│   │   ├── Navigation.tsx                🔄 UPDATED (added ThemeToggle)
│   │   └── admin/
│   │       └── AdminLayout.tsx           🔄 UPDATED (added ThemeToggle)
│   └── App.tsx                           🔄 UPDATED (wrapped with ThemeProvider, added ScrollToTop)
```

---

## 🎯 Technical Details

### Theme System Architecture:

```
ThemeProvider (Context)
    ↓
    ├── ThemeContext (state management)
    ├── localStorage (persistence)
    └── window.matchMedia (system theme detection)
         ↓
    ThemeToggle (UI Component)
         ↓
    Tailwind's dark: classes
```

### Dark Mode Classes:

Tailwind sử dụng `dark:` prefix để style dark mode:
```tsx
// Ví dụ:
<div className="bg-white dark:bg-gray-900">
  <p className="text-black dark:text-white">Text</p>
</div>

// Logo switching:
<img className="dark:hidden" /> {/* Hide trong dark mode */}
<img className="hidden dark:block" /> {/* Show trong dark mode */}
```

---

## 🔧 Customization

### Thay đổi Scroll Threshold:

```tsx
// src/components/ScrollToTop.tsx
if (window.scrollY > 300) { // Thay 300 thành giá trị khác
  setIsVisible(true);
}
```

### Thay đổi Button Position:

```tsx
// src/components/ScrollToTop.tsx
className="fixed bottom-8 right-8 ..." // Thay đổi bottom/right
```

### Thay đổi Default Theme:

```tsx
// src/contexts/ThemeContext.tsx
const [theme, setTheme] = useState<Theme>(() => {
  const stored = localStorage.getItem('theme') as Theme;
  return stored || 'dark'; // Thay 'system' thành 'dark' hoặc 'light'
});
```

---

## 🚀 Usage trong Components khác

### Sử dụng Theme Context:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Applied theme: {actualTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

---

## 📊 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## ⚡ Performance

- **ThemeProvider**: Chỉ re-render khi theme thay đổi
- **ScrollToTop**: Debounced scroll listener (tối ưu performance)
- **localStorage**: Instant theme load, no flash

---

## 🎉 Ready to Use!

Khởi động frontend và test ngay:

```bash
cd web-aesthetic-artefacts-online-client
npm run dev
```

Mở browser: `http://localhost:5173`

---

**Tất cả tính năng đã hoạt động! 🚀**

