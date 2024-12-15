'use client';

import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Inter, Public_Sans } from 'next/font/google';
import '@/styles/admin.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`flex min-h-screen bg-[#F5F5F9] ${inter.variable} ${publicSans.variable}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[70px] bg-white border-b border-[rgba(50,71,92,0.12)] flex items-center px-6">
          {/* Mobile menu button */}
          <button className="lg:hidden">
            {/* Menu icon */}
          </button>

          {/* Search and other header items will go here */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
