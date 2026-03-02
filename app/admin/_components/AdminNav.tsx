'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Settings, Image as ImageIcon, Briefcase, Info, Mail, Calendar } from 'lucide-react';

const navItems = [
  { name: 'General', href: '#meta', icon: Settings },
  { name: 'Hero', href: '#hero', icon: LayoutDashboard },
  { name: 'About Us', href: '#about', icon: Info },
  { name: 'Services', href: '#services', icon: Briefcase },
  { name: 'Gallery', href: '#gallery', icon: ImageIcon },
  { name: 'Booking', href: '#booking', icon: Calendar },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-white tracking-tighter">ADMIN PANEL</h1>
      </div>
      
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all group"
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.name}</span>
          </a>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </nav>
  );
}
