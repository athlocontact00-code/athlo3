'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  Clock,
  Activity,
  Users,
  MessageSquare,
  Bot,
  Calendar,
  Trophy,
  X,
  Command
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Types
interface SearchResult {
  id: string;
  type: 'workout' | 'plan' | 'athlete' | 'message' | 'ai_conversation';
  title: string;
  description?: string;
  date?: string;
  sport?: string;
  author?: string;
  avatar?: string;
  relevance: number;
}

// Mock search results
const mockResults: SearchResult[] = [
  {
    id: 'w1',
    type: 'workout',
    title: 'Tempo Run',
    description: '8km threshold pace with warm-up and cool-down',
    date: '2024-02-14',
    sport: 'running',
    relevance: 95
  },
  {
    id: 'w2',
    type: 'workout',
    title: 'Morning Run',
    description: 'Easy recovery run through the park',
    date: '2024-02-12',
    sport: 'running',
    relevance: 88
  },
  {
    id: 'p1',
    type: 'plan',
    title: 'Marathon Training Plan - Week 8',
    description: 'Progressive long run and tempo work',
    date: '2024-02-10',
    relevance: 92
  },
  {
    id: 'a1',
    type: 'athlete',
    title: 'Anna Kowalski',
    description: 'Coach • Warsaw Runners',
    avatar: '/avatars/anna.jpg',
    relevance: 85
  },
  {
    id: 'm1',
    type: 'message',
    title: 'Great work on yesterday\'s tempo run!',
    description: 'From Coach Anna',
    date: '2024-02-13',
    author: 'Anna Kowalski',
    relevance: 78
  },
  {
    id: 'ai1',
    type: 'ai_conversation',
    title: 'How should I adjust my training load?',
    description: 'AI conversation about training periodization',
    date: '2024-02-11',
    relevance: 82
  }
];

const recentSearches = [
  'tempo run',
  'marathon training',
  'Anna Kowalski',
  'recovery week',
  'interval training'
];

const quickFilters = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'workout', label: 'Workouts', icon: Activity },
  { key: 'plan', label: 'Plans', icon: Calendar },
  { key: 'athlete', label: 'Athletes', icon: Users },
  { key: 'message', label: 'Messages', icon: MessageSquare },
  { key: 'ai_conversation', label: 'AI Chats', icon: Bot }
];

const getResultIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'workout': return Activity;
    case 'plan': return Calendar;
    case 'athlete': return Users;
    case 'message': return MessageSquare;
    case 'ai_conversation': return Bot;
    default: return Search;
  }
};

const getResultColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'workout': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'plan': return 'text-green-500 bg-green-500/10 border-green-500/20';
    case 'athlete': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    case 'message': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'ai_conversation': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
    default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
  }
};

const formatResultType = (type: SearchResult['type']) => {
  switch (type) {
    case 'workout': return 'Workout';
    case 'plan': return 'Training Plan';
    case 'athlete': return 'Athlete';
    case 'message': return 'Message';
    case 'ai_conversation': return 'AI Chat';
    default: return 'Result';
  }
};

interface SearchResultItemProps {
  result: SearchResult;
}

function SearchResultItem({ result }: SearchResultItemProps) {
  const Icon = getResultIcon(result.type);
  const color = getResultColor(result.type);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-all duration-300 cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {result.type === 'athlete' && result.avatar ? (
            <Avatar className="w-10 h-10">
              <AvatarImage src={result.avatar} alt={result.title} />
              <AvatarFallback>{result.title.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          ) : (
            <div className={cn("p-2 rounded-lg", color)}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {result.title}
              </h3>
              <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                {formatResultType(result.type)}
              </Badge>
            </div>
            
            {result.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {result.description}
              </p>
            )}
            
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              {result.date && (
                <span>{new Date(result.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</span>
              )}
              {result.sport && (
                <>
                  <span>•</span>
                  <span className="capitalize">{result.sport}</span>
                </>
              )}
              {result.author && (
                <>
                  <span>•</span>
                  <span>{result.author}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Simulate search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setHasSearched(true);
      
      const timer = setTimeout(() => {
        // Filter results based on query and type
        const filtered = mockResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               result.description?.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = selectedFilter === 'all' || result.type === selectedFilter;
          
          return matchesQuery && matchesFilter;
        });
        
        setSearchResults(filtered.sort((a, b) => b.relevance - a.relevance));
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, selectedFilter]);

  const groupedResults = searchResults.reduce((groups, result) => {
    const type = result.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(result);
    return groups;
  }, {} as Record<string, SearchResult[]>);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground">Search</h1>
          <p className="text-muted-foreground">
            Find workouts, training plans, athletes, messages, and AI conversations
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search across your training data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 text-lg"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
            <Command className="w-3 h-3 mr-1" />
            <span>⌘K to search</span>
          </div>
        </motion.div>

        {/* Quick Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-6">
              {quickFilters.map(({ key, label, icon: Icon }) => (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-1">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            // Recent Searches & Quick Actions
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Recent Searches */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Recent Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery(search)}
                        className="text-sm"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Search Tips */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Search Tips</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Search by workout name, sport, or description</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Find athletes by name or team</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Search through your message history</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Find past AI coach conversations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : isSearching ? (
            // Loading State
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                <span>Searching...</span>
              </div>
            </motion.div>
          ) : (
            // Search Results
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {searchResults.length > 0 ? (
                <>
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} 
                      for "{searchQuery}"
                    </h3>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>

                  {/* Grouped Results */}
                  {selectedFilter === 'all' ? (
                    <div className="space-y-8">
                      {Object.entries(groupedResults).map(([type, results]) => (
                        <div key={type}>
                          <h4 className="text-md font-medium text-foreground mb-3 flex items-center space-x-2">
                            {(() => {
                              const Icon = getResultIcon(type as SearchResult['type']);
                              return <Icon className="w-4 h-4 text-primary" />;
                            })()}
                            <span>{formatResultType(type as SearchResult['type'])}s ({results.length})</span>
                          </h4>
                          <div className="space-y-3">
                            {results.map((result, index) => (
                              <motion.div
                                key={result.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                              >
                                <SearchResultItem result={result} />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <SearchResultItem result={result} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // No Results
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      No results found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filters
                    </p>
                    <Button variant="outline" onClick={clearSearch}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}