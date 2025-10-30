'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isMobile?: boolean;
}

function NavLink({ href, icon, label, isActive, isMobile }: NavLinkProps) {
  const baseStyles = isMobile
    ? 'flex flex-col items-center justify-center flex-1 py-2'
    : 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors';
  
  const activeStyles = isActive
    ? isMobile
      ? 'text-primary-400'
      : 'bg-primary-400/10 text-primary-400 font-medium border border-primary-400/20'
    : isMobile
    ? 'text-text-muted'
    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary';

  return (
    <Link href={href} className={`${baseStyles} ${activeStyles}`}>
      <span className={isMobile ? 'text-2xl' : 'text-xl'}>{icon}</span>
      <span className={isMobile ? 'text-xs mt-1' : 'text-sm'}>{label}</span>
    </Link>
  );
}

interface NavigationProps {
  isMobile?: boolean;
}

export function Navigation({ isMobile }: NavigationProps) {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  const links = [
    { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/swap', icon: '💎', label: 'Swap' },
    { href: '/turbo', icon: '⚡', label: 'Turbo' },
    { href: '/configure', icon: '⚙️', label: 'Configure' },
    { href: '/withdraw', icon: '💰', label: 'Withdraw' },
  ];

  if (!isConnected) return null;

  if (isMobile) {
    return (
      <nav className="flex items-center">
        {links.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            isActive={pathname === link.href}
            isMobile
          />
        ))}
      </nav>
    );
  }

  return (
    <nav className="p-4 space-y-1">
      <div className="mb-4 px-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Menu
        </h2>
      </div>
      {links.map((link) => (
        <NavLink
          key={link.href}
          {...link}
          isActive={pathname === link.href}
        />
      ))}
    </nav>
  );
}

