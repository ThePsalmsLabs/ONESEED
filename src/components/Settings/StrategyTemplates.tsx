'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoStrategiesEmptyState } from '@/components/ui';
import { useStrategyTemplates } from '@/hooks/useStrategyTemplates';
import { useAccount } from 'wagmi';
import { AnimatedCard, AnimatedButton, AnimatedInput } from '@/components/ui/AnimatedComponents';
import { 
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  StarIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { TargetIcon } from 'lucide-react';

interface StrategyTemplatesProps {
  className?: string;
  onTemplateSelect?: (template: any) => void;
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  count: number;
}

const categories: TemplateCategory[] = [
  { id: 'savings', name: 'Savings', description: 'Daily and automated savings strategies', icon: ChartBarIcon, count: 12 },
  { id: 'dca', name: 'DCA', description: 'Dollar-cost averaging strategies', icon: ChartBarIcon, count: 8 },
  { id: 'withdrawal', name: 'Withdrawal', description: 'Smart withdrawal strategies', icon: CurrencyDollarIcon, count: 6 },
  { id: 'trading', name: 'Trading', description: 'Advanced trading strategies', icon: ChartBarIcon, count: 15 },
  { id: 'custom', name: 'Custom', description: 'Your personal strategies', icon: PencilIcon, count: 3 }
];

export function StrategyTemplates({ className = '', onTemplateSelect }: StrategyTemplatesProps) {
  const { address } = useAccount();
  const { templates, userStrategies, isLoading, error, refetch } = useStrategyTemplates();
  
  const [selectedCategory, setSelectedCategory] = useState('savings');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filter templates based on category and search
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = template.category === selectedCategory || selectedCategory === 'all';
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Strategy Templates</h2>
            <p className="text-muted-foreground">Choose from proven savings strategies</p>
          </div>
        </div>
        <LoadingState message="Loading strategy templates..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Strategy Templates</h2>
            <p className="text-muted-foreground">Choose from proven savings strategies</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load strategies"
          message="Unable to fetch your strategy templates. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Show empty state if no templates
  if (templates.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Strategy Templates</h2>
            <p className="text-muted-foreground">Choose from proven savings strategies</p>
          </div>
        </div>
        <NoStrategiesEmptyState onAction={() => setShowCreateForm(true)} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategy Templates</h2>
          <p className="text-muted-foreground">Choose from proven savings strategies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowCreateForm(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Custom
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="w-4 h-4" />
            {category.name}
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
              {filteredTemplates.filter(t => t.category === category.id).length}
            </span>
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <AnimatedInput
          type="text"
          placeholder="Search strategies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <ChartBarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCard className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TargetIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {template.isDefault && (
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                    )}
                    {template.isPublic && (
                      <ShareIcon className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-700">
                      {template.performance.successRate}%
                    </div>
                    <div className="text-xs text-green-600">Success Rate</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-700">
                      {template.performance.averageReturn}%
                    </div>
                    <div className="text-xs text-blue-600">Avg Return</div>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.performance.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                    template.performance.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {template.performance.riskLevel}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setShowDetails(true);
                      }}
                    >
                      <InformationCircleIcon className="w-4 h-4 mr-1" />
                      Details
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={() => onTemplateSelect?.(template)}
                    >
                      <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
                      Use
                    </AnimatedButton>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    by {template.author}
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Template Details Modal */}
      <AnimatePresence>
        {showDetails && selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const template = templates.find(t => t.id === selectedTemplate);
                if (!template) return null;

                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">{template.name}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetails(false)}
                      >
                        Close
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground">{template.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Parameters</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(template.parameters).map(([key, value]) => (
                            <div key={key} className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-medium text-gray-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </div>
                              <div className="text-lg font-bold">
                                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Performance</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-green-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-700">
                              {template.performance.successRate}%
                            </div>
                            <div className="text-sm text-green-600">Success Rate</div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-700">
                              {template.performance.averageReturn}%
                            </div>
                            <div className="text-sm text-blue-600">Average Return</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            onTemplateSelect?.(template);
                            setShowDetails(false);
                          }}
                          className="flex-1"
                        >
                          Use This Strategy
                        </Button>
                        <Button variant="outline">
                          <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}