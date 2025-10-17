'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedCard, AnimatedButton, AnimatedInput } from '@/components/ui/AnimatedComponents';
import { 
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  StarIcon,
  ShareIcon,
  DownloadIcon,
  UploadIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChartBarIcon,
  TargetIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface StrategyTemplatesProps {
  className?: string;
  onTemplateSelect?: (template: StrategyTemplate) => void;
}

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: 'savings' | 'dca' | 'withdrawal' | 'trading' | 'custom';
  type: 'daily' | 'weekly' | 'monthly' | 'conditional' | 'optimized';
  icon: React.ComponentType<any>;
  parameters: Record<string, any>;
  performance: {
    successRate: number;
    averageReturn: number;
    riskLevel: 'low' | 'medium' | 'high';
    popularity: number;
  };
  tags: string[];
  isPublic: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  count: number;
}

const categories: TemplateCategory[] = [
  { id: 'savings', name: 'Savings', description: 'Daily and automated savings strategies', icon: TargetIcon, count: 12 },
  { id: 'dca', name: 'DCA', description: 'Dollar-cost averaging strategies', icon: ChartBarIcon, count: 8 },
  { id: 'withdrawal', name: 'Withdrawal', description: 'Smart withdrawal strategies', icon: CurrencyDollarIcon, count: 6 },
  { id: 'trading', name: 'Trading', description: 'Advanced trading strategies', icon: ChartBarIcon, count: 15 },
  { id: 'custom', name: 'Custom', description: 'Your personal strategies', icon: PencilIcon, count: 3 }
];

export function StrategyTemplates({ className = '', onTemplateSelect }: StrategyTemplatesProps) {
  const [templates, setTemplates] = useState<StrategyTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('savings');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const mockTemplates: StrategyTemplate[] = [
      {
        id: '1',
        name: 'Conservative Daily Savings',
        description: 'Low-risk daily savings with 0.1 ETH per day',
        category: 'savings',
        type: 'daily',
        icon: TargetIcon,
        parameters: {
          amount: 0.1,
          token: 'WETH',
          frequency: 'daily',
          slippage: 0.5,
          autoCompound: true
        },
        performance: {
          successRate: 95,
          averageReturn: 8.5,
          riskLevel: 'low',
          popularity: 85
        },
        tags: ['conservative', 'daily', 'low-risk'],
        isPublic: true,
        isDefault: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        author: 'OneSeed Team'
      },
      {
        id: '2',
        name: 'Aggressive DCA Strategy',
        description: 'High-frequency DCA with market timing',
        category: 'dca',
        type: 'conditional',
        icon: ChartBarIcon,
        parameters: {
          amount: 100,
          token: 'USDC',
          frequency: 'hourly',
          priceThreshold: 0.05,
          maxSlippage: 1.0
        },
        performance: {
          successRate: 78,
          averageReturn: 15.2,
          riskLevel: 'high',
          popularity: 62
        },
        tags: ['aggressive', 'dca', 'high-risk'],
        isPublic: true,
        isDefault: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        author: 'CryptoTrader123'
      },
      {
        id: '3',
        name: 'Smart Withdrawal Optimizer',
        description: 'AI-powered withdrawal timing optimization',
        category: 'withdrawal',
        type: 'optimized',
        icon: CurrencyDollarIcon,
        parameters: {
          gasThreshold: 30,
          volatilityLimit: 5.0,
          timeWindow: 24,
          minSavings: 10
        },
        performance: {
          successRate: 92,
          averageReturn: 12.8,
          riskLevel: 'medium',
          popularity: 73
        },
        tags: ['ai', 'optimization', 'withdrawal'],
        isPublic: true,
        isDefault: false,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-19'),
        author: 'DeFiMaster'
      },
      {
        id: '4',
        name: 'My Custom Strategy',
        description: 'Personal strategy for weekend savings',
        category: 'custom',
        type: 'weekly',
        icon: PencilIcon,
        parameters: {
          amount: 0.05,
          token: 'DAI',
          frequency: 'weekly',
          dayOfWeek: 'sunday'
        },
        performance: {
          successRate: 88,
          averageReturn: 6.2,
          riskLevel: 'low',
          popularity: 0
        },
        tags: ['personal', 'weekly', 'custom'],
        isPublic: false,
        isDefault: false,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
        author: 'You'
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleTemplateSelect = (template: StrategyTemplate) => {
    setSelectedTemplate(template.id);
    onTemplateSelect?.(template);
  };

  const handleCreateTemplate = () => {
    setShowCreateForm(true);
  };

  const handleDuplicateTemplate = (template: StrategyTemplate) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isPublic: false,
      isDefault: false,
      author: 'You',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || ChartBarIcon;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategy Templates</h2>
          <p className="text-muted-foreground">Discover and manage investment strategies</p>
        </div>
        <div className="flex items-center gap-2">
          <AnimatedButton
            variant="outline"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Template
          </AnimatedButton>
        </div>
      </div>

      {/* Search and Filters */}
      <AnimatedCard className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <AnimatedInput
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <AnimatedButton variant="outline" size="sm">
              <DownloadIcon className="w-4 h-4" />
              Import
            </AnimatedButton>
            <AnimatedButton variant="outline" size="sm">
              <UploadIcon className="w-4 h-4" />
              Export
            </AnimatedButton>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <AnimatedButton
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {category.name}
                <span className="text-xs opacity-75">({category.count})</span>
              </AnimatedButton>
            );
          })}
        </div>
      </AnimatedCard>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard 
                className={`p-6 cursor-pointer transition-all ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
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

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-semibold text-green-600">{template.performance.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Return</span>
                    <span className="font-semibold text-blue-600">{template.performance.averageReturn}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(template.performance.riskLevel)}`}>
                      {template.performance.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Popularity</span>
                    <span className="font-semibold">{template.performance.popularity}%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {template.author}</span>
                    <span>{template.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <AnimatedButton
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template);
                    }}
                    className="flex-1"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    Use Template
                  </AnimatedButton>
                  
                  <AnimatedButton
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateTemplate(template);
                    }}
                  >
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  </AnimatedButton>
                  
                  {!template.isDefault && (
                    <AnimatedButton
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </AnimatedButton>
                  )}
                </div>
              </AnimatedCard>
            </motion.div>
          );
        })}
      </div>

      {/* Create Template Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-2xl bg-white rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create New Template</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateForm(false)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Template Name</label>
                    <AnimatedInput placeholder="Enter template name" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      placeholder="Describe your strategy"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="savings">Savings</option>
                        <option value="dca">DCA</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="trading">Trading</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="conditional">Conditional</option>
                        <option value="optimized">Optimized</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isPublic" className="w-4 h-4 text-primary rounded" />
                    <label htmlFor="isPublic" className="text-sm">Make this template public</label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <AnimatedButton
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton>
                    <CheckCircleIcon className="w-4 h-4" />
                    Create Template
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <AnimatedCard className="p-8 text-center">
          <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'No templates match your search' : 'No templates in this category'}
          </p>
          <AnimatedButton onClick={handleCreateTemplate}>
            <PlusIcon className="w-4 h-4" />
            Create Your First Template
          </AnimatedButton>
        </AnimatedCard>
      )}
    </div>
  );
}

