"use client";

/**
 * Professional Dashboard Layout Component
 * Matches UraKompassi landing page design system
 */

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import TeacherFAQ from '@/components/TeacherFAQ';
import {
  LayoutDashboard,
  FolderPlus,
  Building2,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
  premiumOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    href: '/teacher/classes',
    label: 'Luokat',
    icon: LayoutDashboard,
    description: 'Hallitse luokkia',
  },
  {
    href: '/teacher/classes/new',
    label: 'Luo luokka',
    icon: FolderPlus,
    description: 'Uusi luokka',
  },
  {
    href: '/teacher/school',
    label: 'Koulu',
    icon: Building2,
    description: 'Koulun asetukset',
    premiumOnly: true,
  },
];

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);

  // Check premium status on mount
  useEffect(() => {
    const checkPremium = async () => {
      try {
        const res = await fetch('/api/teacher-auth/package-check');
        const data = await res.json();
        if (data.success) {
          setHasPremium(data.hasPremium || data.package === 'premium');
        }
      } catch (error) {
        console.error('Failed to check premium status:', error);
      }
    };
    checkPremium();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/teacher-auth/logout', { method: 'POST' });
      router.push('/teacher/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/teacher/login');
    }
  };

  const isActive = (href: string) => {
    if (href === '/teacher/classes') {
      return pathname === '/teacher/classes' ||
             (pathname.startsWith('/teacher/classes/') && !pathname.includes('/new'));
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Filter nav items based on premium status
  const visibleNavItems = navItems.filter(item => {
    if (item.premiumOnly && !hasPremium) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-urak-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[280px] bg-urak-surface border-r border-urak-border
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-urak-border">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-auto" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-urak-text-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <p className="px-3 py-2 text-[11px] font-semibold text-urak-text-muted uppercase tracking-wider">
            Navigointi
          </p>
          {visibleNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${active
                    ? 'bg-urak-accent-blue/15 text-white border border-urak-accent-blue/30'
                    : 'text-urak-text-secondary hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon
                  className={`h-[18px] w-[18px] ${active ? 'text-urak-accent-blue' : 'text-urak-text-muted group-hover:text-urak-text-secondary'}`}
                />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight className="h-4 w-4 ml-auto text-urak-accent-blue/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-urak-border">
          <button
            onClick={() => setFaqOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-urak-text-secondary hover:text-white hover:bg-white/5 transition-all"
          >
            <HelpCircle className="h-[18px] w-[18px] text-urak-text-muted" />
            <span>Tuki & UKK</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-urak-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-[18px] w-[18px] text-urak-text-muted" />
            <span>Kirjaudu ulos</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-[280px] min-h-screen">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 h-16 bg-urak-bg/80 backdrop-blur-xl border-b border-urak-border">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-urak-text-secondary"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Title section */}
            <div className="hidden lg:block">
              {title && (
                <div>
                  <h1 className="text-lg font-semibold text-white">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-urak-text-muted">{subtitle}</p>
                  )}
                </div>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {actions}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {/* Mobile title */}
          {title && (
            <div className="lg:hidden mb-6">
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-urak-text-muted mt-1">{subtitle}</p>
              )}
            </div>
          )}

          {children}
        </main>
      </div>

      {/* FAQ Modal */}
      <TeacherFAQ isOpen={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  );
}
