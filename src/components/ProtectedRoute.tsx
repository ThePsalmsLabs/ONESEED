'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loading } from './ui/Loading';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnecting && !isConnected) {
      router.push('/');
    }
  }, [isConnected, isConnecting, router]);

  if (isConnecting || !isConnected) {
    return <Loading text="Connecting..." />;
  }

  return <>{children}</>;
}

