'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedCard, AnimatedButton, AnimatedTabs } from '@/components/ui/AnimatedComponents';
import { 
  CogIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  SwatchIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { UserPreferences } from './UserPreferences';
import { StrategyTemplates } from './StrategyTemplates';
import { ComparisonTools } from './ComparisonTools';

interface SettingsDashboardProps {
  className?: string;
}

interface SettingsSection {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  badge?: string;
  isNew?: boolean;
}

const sections: SettingsSection[] = [
  {
    id: 'preferences',
    name: 'User Preferences',
    description: 'Customize your account and interface settings',
    icon: UserIcon,
    component: UserPreferences
  },
  {
    id: 'templates',
    name: 'Strategy Templates',
    description: 'Manage and create investment strategy templates',
    icon: DocumentDuplicateIcon,
    component: StrategyTemplates,
    badge: '12',
    isNew: true
  },
  {
    id: 'comparison',
    name: 'Comparison Tools',
    description: 'Compare and analyze different strategies',
    icon: ChartBarIcon,
    component: ComparisonTools
  }
];

export function SettingsDashboard({ className = '' }: SettingsDashboardProps) {
  const [activeSection, setActiveSection] = useState('preferences');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSectionChange = (sectionId: string) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch sections?');
      if (!confirmed) return;
    }
    setActiveSection(sectionId);
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate save operation
    setTimeout(() => {
      setIsLoading(false);
      setHasUnsavedChanges(false);
    }, 2000);
  };

  const renderActiveSection = () => {
    const section = sections.find(s => s.id === activeSection);
    if (!section) return null;

    const Component = section.component;
    return <Component onSave={handleSave} />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your OneSeed configuration and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <ExclamationTriangleIcon className="w-4 h-4" />
              Unsaved changes
            </div>
          )}
          <AnimatedButton
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                Save All
              </>
            )}
          </AnimatedButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <AnimatedCard className="p-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <AnimatedButton
                key={section.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => handleSectionChange(section.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {section.name}
                {section.badge && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    {section.badge}
                  </span>
                )}
                {section.isNew && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    New
                  </span>
                )}
              </AnimatedButton>
            );
          })}
        </div>
      </AnimatedCard>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveSection()}
        </motion.div>
      </AnimatePresence>

      {/* Quick Actions */}
      <AnimatedCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatedButton
            variant="outline"
            className="flex items-center gap-2 h-auto p-4"
          >
            <div className="text-left">
              <div className="font-medium">Export Settings</div>
              <div className="text-sm text-muted-foreground">Download your configuration</div>
            </div>
          </AnimatedButton>
          
          <AnimatedButton
            variant="outline"
            className="flex items-center gap-2 h-auto p-4"
          >
            <div className="text-left">
              <div className="font-medium">Import Settings</div>
              <div className="text-sm text-muted-foreground">Upload configuration file</div>
            </div>
          </AnimatedButton>
          
          <AnimatedButton
            variant="outline"
            className="flex items-center gap-2 h-auto p-4"
          >
            <div className="text-left">
              <div className="font-medium">Reset to Defaults</div>
              <div className="text-sm text-muted-foreground">Restore original settings</div>
            </div>
          </AnimatedButton>
        </div>
      </AnimatedCard>

      {/* Settings Summary */}
      <AnimatedCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Settings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="font-semibold">Profile</div>
            <div className="text-sm text-muted-foreground">Configured</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <BellIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="font-semibold">Notifications</div>
            <div className="text-sm text-muted-foreground">5 enabled</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <DocumentDuplicateIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="font-semibold">Templates</div>
            <div className="text-sm text-muted-foreground">3 custom</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
              <ChartBarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="font-semibold">Comparisons</div>
            <div className="text-sm text-muted-foreground">2 saved</div>
          </div>
        </div>
      </AnimatedCard>

      {/* Help and Support */}
      <AnimatedCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <InformationCircleIcon className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">Need Help?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Documentation</h4>
            <p className="text-sm text-muted-foreground">
              Learn how to configure your settings and create effective strategies.
            </p>
            <AnimatedButton variant="outline" size="sm">
              View Docs
            </AnimatedButton>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Support</h4>
            <p className="text-sm text-muted-foreground">
              Get help from our community or contact support directly.
            </p>
            <AnimatedButton variant="outline" size="sm">
              Get Support
            </AnimatedButton>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}

