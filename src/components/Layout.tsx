import React, { useState, useEffect } from 'react';
import { Home, ShoppingCart, CreditCard, FileText, Wallet, Snowflake, Menu, X, Bell, Search, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Ringkasan & Statistik' },
    { id: 'sales', label: 'Penjualan', icon: ShoppingCart, description: 'Catat Penjualan Es Batu' },
    { id: 'expenses', label: 'Pengeluaran', icon: CreditCard, description: 'Kelola Biaya Operasional' },
    { id: 'reports', label: 'Laporan', icon: FileText, description: 'Analisis & Export Data' },
    { id: 'cash', label: 'Kas / Saldo', icon: Wallet, description: 'Monitor Arus Kas' },
  ];

  const getPageTitle = () => {
    const currentItem = navItems.find(item => item.id === currentPage);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Snowflake className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Pua Ranga</h1>
                <p className="text-blue-100 text-sm">Manajemen Es Batu</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full group flex items-start space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-gray-50 hover:scale-[1.01] hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${
                  currentPage === item.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    currentPage === item.id ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                  }`} />
                </div>
                <div className="text-left">
                  <div className={`font-semibold ${
                    currentPage === item.id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.label}
                  </div>
                  <div className={`text-sm ${
                    currentPage === item.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Time Display */}
        <div className="absolute bottom-6 left-6 right-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {currentTime.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long',
                day: 'numeric',
                month: 'short'
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-30">
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{getPageTitle()}</h2>
                  <p className="text-sm text-gray-600">
                    {navItems.find(item => item.id === currentPage)?.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari transaksi..."
                    className="bg-transparent text-sm border-none outline-none placeholder-gray-400"
                  />
                </div>
                
                <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full px-4 py-2 text-white">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;