import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    // navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg group-hover:bg-white/30 transition-all">
              <span className="text-white text-2xl font-bold">⚡</span>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight italic">
              Frictionless
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="#" 
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
            >
              <span className="font-medium">🏠 Home</span>
            </a>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border border-white/30 hover:scale-105"
            >
              <span>🚪 Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-white/80 transition-colors p-2 hover:bg-white/10 rounded-lg text-2xl"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-white/20">
          <div className="px-4 py-3 space-y-2">
            <a 
              href="#" 
              className="flex items-center gap-3 text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all"
            >
              <span className="font-medium">🏠 Home</span>
            </a>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg font-medium transition-all"
            >
              <span>🚪 Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;