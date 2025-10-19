'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedCard, AnimatedButton, AnimatedInput, AnimatedTabs } from '@/components/ui/AnimatedComponents';
import { 
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  PaletteIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  ClockIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface UserPreferencesProps {
  className?: string;
  onSave?: (preferences: UserPreferences) => void;
}

interface UserPreferences {
  profile: {
    displayName: string;
    email: string;
    avatar: string;
    bio: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    savingsAlerts: boolean;
    dcaAlerts: boolean;
    withdrawalAlerts: boolean;
    marketAlerts: boolean;
    securityAlerts: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showPortfolio: boolean;
    showTransactions: boolean;
    showGoals: boolean;
    dataSharing: boolean;
    analytics: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    animations: boolean;
    soundEffects: boolean;
  };
  trading: {
    defaultSlippage: number;
    autoApprove: boolean;
    confirmTransactions: boolean;
    gasOptimization: boolean;
    priceAlerts: boolean;
    stopLoss: boolean;
  };
  security: {
    twoFactor: boolean;
    biometric: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
    deviceTrust: boolean;
    ipWhitelist: boolean;
  };
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'privacy', label: 'Privacy', icon: ShieldCheckIcon },
  { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
  { id: 'trading', label: 'Trading', icon: CurrencyDollarIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon }
];

export function UserPreferences({ className = '', onSave }: UserPreferencesProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState<UserPreferences>({
    profile: {
      displayName: '',
      email: '',
      avatar: '',
      bio: '',
      timezone: 'UTC',
      language: 'en'
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      savingsAlerts: true,
      dcaAlerts: true,
      withdrawalAlerts: true,
      marketAlerts: false,
      securityAlerts: true
    },
    privacy: {
      profileVisibility: 'private',
      showPortfolio: false,
      showTransactions: false,
      showGoals: false,
      dataSharing: false,
      analytics: true
    },
    appearance: {
      theme: 'auto',
      primaryColor: '#3B82F6',
      fontSize: 'medium',
      compactMode: false,
      animations: true,
      soundEffects: false
    },
    trading: {
      defaultSlippage: 0.5,
      autoApprove: false,
      confirmTransactions: true,
      gasOptimization: true,
      priceAlerts: true,
      stopLoss: false
    },
    security: {
      twoFactor: false,
      biometric: false,
      sessionTimeout: 30,
      loginNotifications: true,
      deviceTrust: false,
      ipWhitelist: false
    }
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = (section: keyof UserPreferences, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasChanges(false);
      onSave?.(preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <AnimatedInput
            value={preferences.profile.displayName}
            onChange={(e) => handlePreferenceChange('profile', 'displayName', e.target.value)}
            placeholder="Enter your display name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <AnimatedInput
            type="email"
            value={preferences.profile.email}
            onChange={(e) => handlePreferenceChange('profile', 'email', e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={preferences.profile.timezone}
            onChange={(e) => handlePreferenceChange('profile', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="GMT">Greenwich Mean Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={preferences.profile.language}
            onChange={(e) => handlePreferenceChange('profile', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            value={preferences.profile.bio}
            onChange={(e) => handlePreferenceChange('profile', 'bio', e.target.value)}
            placeholder="Tell us about yourself"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BellIcon className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium">General Notifications</h4>
            {[
              { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', description: 'Browser and mobile notifications' },
              { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications[item.key as keyof typeof preferences.notifications] as boolean}
                  onChange={(e) => handlePreferenceChange('notifications', item.key, e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Alert Types</h4>
            {[
              { key: 'savingsAlerts', label: 'Savings Alerts', description: 'Daily savings execution' },
              { key: 'dcaAlerts', label: 'DCA Alerts', description: 'Dollar-cost averaging updates' },
              { key: 'withdrawalAlerts', label: 'Withdrawal Alerts', description: 'Withdrawal confirmations' },
              { key: 'marketAlerts', label: 'Market Alerts', description: 'Price and volatility alerts' },
              { key: 'securityAlerts', label: 'Security Alerts', description: 'Security-related notifications' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications[item.key as keyof typeof preferences.notifications] as boolean}
                  onChange={(e) => handlePreferenceChange('notifications', item.key, e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Privacy Settings</h3>
          <p className="text-sm text-muted-foreground">Control your privacy and data sharing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Profile Visibility</label>
          <select
            value={preferences.privacy.profileVisibility}
            onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Data Sharing</h4>
          {[
            { key: 'showPortfolio', label: 'Show Portfolio', description: 'Display your portfolio publicly' },
            { key: 'showTransactions', label: 'Show Transactions', description: 'Display transaction history' },
            { key: 'showGoals', label: 'Show Goals', description: 'Display your savings goals' },
            { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymized data for research' },
            { key: 'analytics', label: 'Analytics', description: 'Help improve the platform' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.privacy[item.key as keyof typeof preferences.privacy] as boolean}
                onChange={(e) => handlePreferenceChange('privacy', item.key, e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PaletteIcon className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Appearance Settings</h3>
          <p className="text-sm text-muted-foreground">Customize your interface</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select
            value={preferences.appearance.theme}
            onChange={(e) => handlePreferenceChange('appearance', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Primary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={preferences.appearance.primaryColor}
              onChange={(e) => handlePreferenceChange('appearance', 'primaryColor', e.target.value)}
              className="w-10 h-10 rounded border border-border"
            />
            <span className="text-sm text-muted-foreground">{preferences.appearance.primaryColor}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Font Size</label>
          <select
            value={preferences.appearance.fontSize}
            onChange={(e) => handlePreferenceChange('appearance', 'fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Interface Options</h4>
          {[
            { key: 'compactMode', label: 'Compact Mode', description: 'Use compact interface layout' },
            { key: 'animations', label: 'Animations', description: 'Enable interface animations' },
            { key: 'soundEffects', label: 'Sound Effects', description: 'Play sound effects' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.appearance[item.key as keyof typeof preferences.appearance] as boolean}
                onChange={(e) => handlePreferenceChange('appearance', item.key, e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTradingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CurrencyDollarIcon className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Trading Preferences</h3>
          <p className="text-sm text-muted-foreground">Configure your trading behavior</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Default Slippage Tolerance (%)</label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.1"
            value={preferences.trading.defaultSlippage}
            onChange={(e) => handlePreferenceChange('trading', 'defaultSlippage', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Transaction Settings</h4>
          {[
            { key: 'autoApprove', label: 'Auto Approve', description: 'Automatically approve small transactions' },
            { key: 'confirmTransactions', label: 'Confirm Transactions', description: 'Always confirm before executing' },
            { key: 'gasOptimization', label: 'Gas Optimization', description: 'Optimize gas usage automatically' },
            { key: 'priceAlerts', label: 'Price Alerts', description: 'Get notified of price changes' },
            { key: 'stopLoss', label: 'Stop Loss', description: 'Enable automatic stop loss' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.trading[item.key as keyof typeof preferences.trading] as boolean}
                onChange={(e) => handlePreferenceChange('trading', item.key, e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Security Settings</h3>
          <p className="text-sm text-muted-foreground">Protect your account and data</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
          <select
            value={preferences.security.sessionTimeout}
            onChange={(e) => handlePreferenceChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
          </select>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Security Features</h4>
          {[
            { key: 'twoFactor', label: 'Two-Factor Authentication', description: 'Add an extra layer of security' },
            { key: 'biometric', label: 'Biometric Authentication', description: 'Use fingerprint or face ID' },
            { key: 'loginNotifications', label: 'Login Notifications', description: 'Get notified of new logins' },
            { key: 'deviceTrust', label: 'Device Trust', description: 'Remember trusted devices' },
            { key: 'ipWhitelist', label: 'IP Whitelist', description: 'Restrict access to specific IPs' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.security[item.key as keyof typeof preferences.security] as boolean}
                onChange={(e) => handlePreferenceChange('security', item.key, e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'privacy': return renderPrivacyTab();
      case 'appearance': return renderAppearanceTab();
      case 'trading': return renderTradingTab();
      case 'security': return renderSecurityTab();
      default: return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Preferences</h2>
          <p className="text-muted-foreground">Customize your OneSeed experience</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <ExclamationTriangleIcon className="w-4 h-4" />
              Unsaved changes
            </div>
          )}
          <AnimatedButton
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                Save Changes
              </>
            )}
          </AnimatedButton>
        </div>
      </div>

      {/* Tabs */}
      <AnimatedTabs
        tabs={tabs.map(tab => ({
          id: tab.id,
          label: tab.label,
          content: renderTabContent()
        }))}
        defaultTab={activeTab}
        onTabChange={setActiveTab}
        className="w-full"
      />
    </div>
  );
}

