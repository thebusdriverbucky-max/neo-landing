'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Settings, Image as ImageIcon, Briefcase, Info, Mail, Calendar, MessageSquare, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'General', href: '#meta', icon: Settings },
  { name: 'Hero', href: '#hero', icon: LayoutDashboard },
  { name: 'About Us', href: '#about', icon: Info },
  { name: 'Services', href: '#services', icon: Briefcase },
  { name: 'Gallery', href: '#gallery', icon: ImageIcon },
  { name: 'Booking', href: '#booking', icon: Calendar },
  { name: 'Contact', href: '#contact', icon: Mail },
  { name: 'Messages', href: '#messages', icon: MessageSquare },
];

export default function AdminNav() {
  const router = useRouter();
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBookingCount = async () => {
      try {
        const response = await fetch('/api/admin/bookings?limit=1', {
          signal: controller.signal
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Silent fail for unauthorized, maybe user logged out
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't got JSON!");
        }

        const data = await response.json();
        if (data.pagination) {
          setBookingCount(data.pagination.total);
        }
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message === 'Failed to fetch') {
          return;
        }
        console.error('Failed to fetch booking count:', error);
      }
    };

    fetchBookingCount();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchBookingCount, 30000);
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={onClick}
            className="flex items-center justify-between px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.name}</span>
            </div>
            {item.name === 'Messages' && bookingCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                {bookingCount > 9 ? '9+' : bookingCount}
              </span>
            )}
          </a>
        ))}
      </div>

      <button
        onClick={() => {
          handleLogout();
          onClick?.();
        }}
        className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between z-50 w-full">
        <h1 className="text-lg font-bold text-white tracking-tighter">ADMIN PANEL</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tighter">ADMIN PANEL</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <NavLinks onClick={() => setIsOpen(false)} />
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-white tracking-tighter">ADMIN PANEL</h1>
        </div>
        <NavLinks />
      </nav>
    </>
  );
}
