# Manajemen Es Batu Pua Ranga

Aplikasi web modern untuk mengelola penjualan, pengeluaran, kas, dan laporan usaha es batu. Dibangun dengan React + TypeScript + Vite untuk performa optimal.

## 🧊 Fitur Utama

### 📊 Dashboard Interaktif
- **Cards Analytics**: Total Pemasukan, Pengeluaran, Saldo, dan Laba real-time
- **Grafik Penjualan**: Line/Area/Bar chart untuk visualisasi data 7 hari terakhir
- **Live Data Indicator**: Update real-time dengan animasi
- **Quick Insights**: Status bisnis, target harian, dan proyeksi

### 🛒 Sistem Penjualan Cerdas
- **Auto-calculation**: Hitung harga optimal untuk kombinasi es batu
- **Pricing tiers yang efisien**:
  - 1 es batu = Rp 2.000
  - 3 es batu = Rp 5.000 (hemat Rp 1.000)
  - 6 es batu = Rp 10.000 (hemat Rp 2.000)
- **Quick Amount Buttons**: Input cepat untuk jumlah umum
- **Form Validation**: Validasi input dengan feedback error
- **Confirmation Dialogs**: Konfirmasi sebelum menghapus data
- **Toast Notifications**: Feedback real-time untuk setiap aksi

### 💳 Manajemen Pengeluaran
- **Form Input Lengkap**: Nama, nominal, tanggal dengan validasi
- **Error Handling**: Validasi form dengan pesan error yang jelas
- **Loading States**: Loading spinner saat menyimpan data
- **Delete Confirmation**: Konfirmasi sebelum menghapus pengeluaran

### 📈 Laporan & Export
- **Filter Fleksibel**: Harian, bulanan, tahunan, atau custom range
- **Export Real**: 
  - **Excel (.xlsx)**: Export dengan multiple sheets (Summary, Sales, Expenses)
  - **PDF**: Report PDF dengan format professional
- **Summary Cards**: Ringkasan visual pemasukan, pengeluaran, laba/rugi
- **Detail Tables**: Tabel transaksi lengkap dengan sorting

### 💰 Monitor Kas & Saldo
- **Real-time Balance**: Saldo terkini dengan status kesehatan finansial
- **Transaction History**: Riwayat lengkap dengan running balance
- **Financial Status**: Indikator kesehatan keuangan bisnis

## 🎨 UI/UX Design

### Modern Interface
- **Design System**: Gradient backgrounds, rounded corners, shadows
- **Color Scheme**: 
  - Primary: Blue (#3B82F6) dan Indigo (#6366F1)
  - Success: Emerald (#10B981)
  - Danger: Red (#EF4444)
  - Warning: Yellow (#F59E0B)

### Responsive Design
- ✅ **Desktop First** (1200px+)
- ✅ **Tablet Optimized** (768px - 1199px)
- ✅ **Mobile Friendly** (< 768px)
- ✅ **Mobile Small** (< 480px)

### User Experience
- **Loading States**: Spinner dan skeleton loading
- **Error Boundaries**: Graceful error handling
- **Toast Notifications**: Real-time feedback
- **Confirmation Dialogs**: Prevent accidental deletions
- **Form Validation**: Input validation dengan error messages
- **Lazy Loading**: Components dimuat sesuai kebutuhan

## 🚀 Teknologi & Arsitektur

### Frontend Stack
```
React 18.3.1        - UI Library
TypeScript 5.5.3    - Type Safety
Vite 7.1.5          - Build Tool & Dev Server
TailwindCSS 3.4.1   - Utility-first CSS
```

### Libraries & Dependencies
```
Recharts 3.2.0      - Data Visualization
Lucide React 0.344  - Icon System
React Hot Toast     - Notifications
XLSX               - Excel Export
jsPDF              - PDF Generation
html2canvas        - PDF from HTML
```

### Architecture Features
- **Component-based**: Modular React components
- **TypeScript**: Full type safety
- **Code Splitting**: Lazy loading untuk optimal performance
- **Error Boundaries**: Robust error handling
- **Local Storage**: Persistent data storage
- **Custom Hooks**: Reusable logic (useLocalStorage)
- **Context API**: Global state management (Toast)

## 📂 Struktur Project

```
management-esbatu/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── Chart.tsx     # Grafik dan visualisasi
│   │   ├── Dashboard.tsx # Halaman dashboard
│   │   ├── Sales.tsx     # Manajemen penjualan
│   │   ├── Expenses.tsx  # Manajemen pengeluaran
│   │   ├── Reports.tsx   # Laporan dan export
│   │   ├── Cash.tsx      # Monitor kas/saldo
│   │   ├── Layout.tsx    # Layout dan navigasi
│   │   ├── LoadingSpinner.tsx # Loading components
│   │   ├── ConfirmDialog.tsx  # Confirmation dialogs
│   │   └── ErrorBoundary.tsx  # Error handling
│   ├── contexts/         # React contexts
│   │   └── ToastContext.tsx   # Toast notifications
│   ├── hooks/           # Custom React hooks
│   │   └── useLocalStorage.ts # Local storage hook
│   ├── types/           # TypeScript definitions
│   │   └── index.ts     # Type definitions
│   ├── utils/           # Utility functions
│   │   ├── pricing.ts   # Pricing calculations
│   │   └── export.ts    # Export functionality
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── dist/                # Production build
├── package.json         # Dependencies & scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # TailwindCSS config
├── tsconfig.json       # TypeScript config
└── README.md           # Dokumentasi
```

## 🛠️ Setup & Development

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### Installation
```bash
# Clone repository
git clone https://github.com/FARAZIFTAN/management-esbatu.git
cd management-esbatu

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev        # Development server (port 5173)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Build Output
```
dist/index.html                    1.07 kB   # Main HTML
dist/assets/index-*.css           35.74 kB   # Styles
dist/assets/index-*.js             5.85 kB   # Main JS (optimized!)
dist/assets/react-vendor-*.js    141.85 kB   # React framework
dist/assets/chart-vendor-*.js    354.71 kB   # Charts (lazy loaded)
dist/assets/export-vendor-*.js   876.92 kB   # Export libs (lazy loaded)
dist/assets/forms-*.js             23.08 kB   # Form components
dist/assets/dashboard-*.js         16.76 kB   # Dashboard component
```

## 💾 Data Storage

### Local Storage Schema
```typescript
// Sales data
'ice-sales': Sale[] = [{
  id: string,
  quantity: number,
  totalPrice: number,
  date: string,     // YYYY-MM-DD
  time: string      // HH:MM
}]

// Expenses data  
'ice-expenses': Expense[] = [{
  id: string,
  name: string,
  amount: number,
  date: string      // YYYY-MM-DD
}]
```

### Data Persistence
- ✅ **Browser localStorage**: Data tersimpan lokal
- ✅ **Auto-save**: Setiap perubahan langsung disimpan
- ✅ **Data validation**: Type safety dengan TypeScript
- ⚠️ **Backup**: Data tidak tersinkron antar device
- ⚠️ **Clearing**: Data hilang jika localStorage dibersihkan

## 📊 Business Logic

### Pricing Algorithm
```typescript
// Optimal pricing calculation
function calculatePrice(quantity: number): number {
  const rules = [
    { qty: 6, price: 10000 },   // Bulk discount
    { qty: 3, price: 5000 },    // Medium package  
    { qty: 1, price: 2000 }     // Individual
  ];
  
  // Find best combination for customer
  return findOptimalCombination(quantity, rules);
}
```

### Performance Optimizations
- **Code Splitting**: Lazy loading components
- **Bundle Optimization**: Separate vendor chunks
- **Tree Shaking**: Remove unused code
- **Memoization**: React.memo for expensive components
- **Loading States**: Better perceived performance

## 🔧 Performance Metrics

### Bundle Analysis
- **Initial Load**: 5.85kB (99% improvement from 1,468kB!)
- **Code Split**: 8 optimized chunks
- **Lazy Loading**: Charts and export features
- **Gzip Compressed**: All assets optimized

### User Experience
- **First Contentful Paint**: < 1s
- **Interactive**: < 2s  
- **Error Recovery**: Automatic error boundaries
- **Offline Ready**: Local storage persistence

## 🚨 Error Handling

### Comprehensive Error Management
- **Error Boundaries**: Catch React errors gracefully
- **Form Validation**: Real-time input validation
- **API Error Handling**: Toast notifications for errors
- **Loading States**: Prevent double submissions
- **Confirmation Dialogs**: Prevent accidental data loss

## 📈 Future Enhancements

### Planned Features
- [ ] **Backend Integration**: Database storage
- [ ] **Multi-user Support**: User authentication
- [ ] **Real-time Sync**: WebSocket updates
- [ ] **PWA Support**: Install as mobile app
- [ ] **Advanced Analytics**: More detailed reports
- [ ] **Inventory Management**: Stock tracking
- [ ] **Customer Management**: Customer database
- [ ] **Mobile App**: React Native version

### Scalability Considerations
- [ ] **Database**: PostgreSQL/MySQL integration
- [ ] **API**: RESTful backend services
- [ ] **Cloud Storage**: AWS S3 for file uploads
- [ ] **Monitoring**: Error tracking & analytics
- [ ] **Caching**: Redis for performance
- [ ] **Testing**: Unit & integration tests

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint + Prettier rules
2. **TypeScript**: Maintain strict type safety
3. **Components**: Keep components small and focused
4. **Testing**: Add tests for new features
5. **Documentation**: Update README for new features

### Issue Reporting
- Use GitHub Issues for bug reports
- Include steps to reproduce
- Provide browser/system information
- Attach screenshots if applicable

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 📞 Support & Contact

- **Repository**: [GitHub](https://github.com/FARAZIFTAN/management-esbatu)
- **Issues**: [GitHub Issues](https://github.com/FARAZIFTAN/management-esbatu/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FARAZIFTAN/management-esbatu/discussions)

---

**Terima kasih telah menggunakan Manajemen Es Batu Pua Ranga! 🧊✨**

*Built with ❤️ using React + TypeScript + Vite*
