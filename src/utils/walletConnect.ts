/**
 * Utility functions for managing WalletConnect storage
 * These functions help resolve issues with stale WalletConnect data
 */

/**
 * Clears all WalletConnect-related data from localStorage
 * Useful when encountering "Restore will override" errors
 */
export function clearWalletConnectStorage(): void {
  if (typeof window === 'undefined') return

  try {
    // Clear WalletConnect v2 data
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith('wc@2') ||
        key.startsWith('WALLETCONNECT') ||
        key.startsWith('wagmi') ||
        key.includes('reown') ||
        key.includes('appkit')
      )) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })

    console.log(`Cleared ${keysToRemove.length} WalletConnect storage items`)
  } catch (error) {
    console.error('Error clearing WalletConnect storage:', error)
  }
}

/**
 * Clears only the problematic expirer and pairing data
 */
export function clearWalletConnectExpirer(): void {
  if (typeof window === 'undefined') return

  try {
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.includes('expirer') ||
        key.includes('pairing') ||
        key.includes('session') ||
        key.includes('history') ||
        key.includes('restore')
      )) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })

    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length} WalletConnect storage items to prevent restore warnings`)
    }
  } catch (error) {
    console.error('Error clearing WalletConnect expirer:', error)
  }
}

/**
 * Development helper: Call this in browser console if you encounter issues
 * window.clearWalletConnect()
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // @ts-expect-error - Development helper attached to window
  window.clearWalletConnect = clearWalletConnectStorage
}

