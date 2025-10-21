'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useSessionKeys } from '@/hooks/useSessionKeys';
import { useDCA } from '@/hooks/useDCA';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertTriangle,
  Key,
  Zap,
  Calendar
} from 'lucide-react';

interface DCASessionManagerProps {
  onSessionCreated?: () => void;
  onSessionRevoked?: () => void;
}

interface DCASession {
  id: string;
  type: 'DCA Auto-Invest';
  expires: Date;
  status: 'Active' | 'Expired' | 'Revoked';
  executions: number;
  lastUsed: Date;
  canRenew: boolean;
}

export function DCASessionManager({ onSessionCreated, onSessionRevoked }: DCASessionManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { createSession, renewSession, revokeSession, sessions } = useSessionKeys();
  const { config, isEnabling } = useDCA();

  // Use real session data from the hook
  const dcaSessions: DCASession[] = sessions?.filter(session => 
    session.type === 'DCA Auto-Invest'
  ).map(session => ({
    id: session.id,
    type: 'DCA Auto-Invest',
    expires: new Date(session.expires),
    status: session.status as 'Active' | 'Expired' | 'Revoked',
    executions: session.executions || 0,
    lastUsed: new Date(session.lastUsed),
    canRenew: session.canRenew
  })) || [];

  const handleCreateSession = async () => {
    if (!config?.enabled) {
      alert('Please enable DCA first before creating a session key');
      return;
    }

    setIsCreating(true);
    try {
      // Create session key for DCA automation
      await createSession({
        permissions: {
          executeDCA: true,
          checkBalances: true,
          monitorQueue: true
        },
        duration: 7 * 24 * 60 * 60 * 1000, // 7 days
        description: 'DCA Auto-Invest Session'
      });
      
      setShowCreateModal(false);
      onSessionCreated?.();
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenewSession = async (sessionId: string) => {
    try {
      await renewSession(sessionId, 7 * 24 * 60 * 60 * 1000); // 7 days
    } catch (error) {
      console.error('Failed to renew session:', error);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      onSessionRevoked?.();
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Expired':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Revoked':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'Revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (expires: Date) => {
    const now = new Date();
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return 'Less than 1 hour remaining';
  };

  const formatLastUsed = (lastUsed: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastUsed.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Auto-Invest Sessions</h2>
          <p className="text-gray-600">Manage your automated DCA execution sessions</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          disabled={!config?.enabled || isEnabling}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          <Key className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      {!config?.enabled && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">DCA Not Enabled</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              You need to enable DCA first before creating session keys for automation.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {dcaSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(session.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.type}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {session.executions} executions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatTimeRemaining(session.expires)}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Last used: {formatLastUsed(session.lastUsed)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4" />
                  <span>Automated DCA execution enabled</span>
                </div>

                <div className="flex items-center space-x-2">
                  {session.status === 'Active' && session.canRenew && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRenewSession(session.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Renew
                    </Button>
                  )}
                  
                  {session.status === 'Expired' && session.canRenew && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRenewSession(session.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reactivate
                    </Button>
                  )}

                  {session.status === 'Active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {dcaSessions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Sessions</h3>
              <p className="text-gray-600 mb-4">
                Create a session key to enable automated DCA execution without manual signing.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                disabled={!config?.enabled}
              >
                <Key className="w-4 h-4 mr-2" />
                Create Your First Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Enable Auto-Invest</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Execute DCA</h4>
                    <p className="text-sm text-gray-600">Automatically buy your target token</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Check Balances</h4>
                    <p className="text-sm text-gray-600">Monitor your savings balance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Monitor Queue</h4>
                    <p className="text-sm text-gray-600">Track execution status</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Valid for 7 days (auto-renews)</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  💡 <strong>Like setting up autopay for your bank account</strong> - 
                  you sign once to enable automation, and can revoke anytime.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSession}
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Sign to Enable
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
