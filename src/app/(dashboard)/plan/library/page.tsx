'use client';

import { useState } from 'react';
import { Search, Filter, Star, Clock, Target, User, Calendar, Plus, ArrowRight, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

type Sport = 'running' | 'cycling' | 'triathlon' | 'swimming' | 'strength' | 'hyrox';
type Duration = '4-8' | '8-12' | '12-16' | '16-20' | '20+';
type Difficulty = 1 | 2 | 3 | 4 | 5;
type Goal = '5k' | '10k' | 'half-marathon' | 'marathon' | 'triathlon' | 'cycling' | 'fitness' | 'hyrox';

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  sport: Sport;
  goal: Goal;
  duration: Duration;
  weeksCount: number;
  difficulty: Difficulty;
  totalWorkouts: number;
  avgWeeklyHours: number;
  rating: number;
  reviews: number;
  author: {
    name: string;
    isCoach: boolean;
    avatar?: string;
  };
  tags: string[];
  price?: number;
  isPro?: boolean;
  preview: {
    philosophy: string;
    weeklyStructure: string[];
    phases: { name: string; weeks: number }[];
  };
}

// Mock training plans data
const mockPlans: TrainingPlan[] = [
  {
    id: '1',
    name: 'Sub-3 Marathon Plan',
    description: 'Advanced marathon training plan designed to break the 3-hour barrier. High mileage with tempo and speed work.',
    sport: 'running',
    goal: 'marathon',
    duration: '16-20',
    weeksCount: 18,
    difficulty: 5,
    totalWorkouts: 108,
    avgWeeklyHours: 8.5,
    rating: 4.8,
    reviews: 234,
    author: { name: 'Coach Sarah Miller', isCoach: true },
    tags: ['advanced', 'high-mileage', 'tempo', 'marathon'],
    price: 49.99,
    isPro: true,
    preview: {
      philosophy: 'This plan combines high mileage base building with targeted speed work to achieve a sub-3 marathon goal.',
      weeklyStructure: ['Easy Run', 'Tempo/Threshold', 'Easy Run', 'Intervals', 'Easy Run', 'Long Run', 'Rest'],
      phases: [
        { name: 'Base Building', weeks: 6 },
        { name: 'Build 1', weeks: 4 },
        { name: 'Build 2', weeks: 4 },
        { name: 'Peak', weeks: 2 },
        { name: 'Taper', weeks: 2 }
      ]
    }
  },
  {
    id: '2',
    name: 'First Marathon Finisher',
    description: 'Beginner-friendly 20-week plan to help you cross your first marathon finish line with confidence.',
    sport: 'running',
    goal: 'marathon',
    duration: '16-20',
    weeksCount: 20,
    difficulty: 2,
    totalWorkouts: 120,
    avgWeeklyHours: 4.5,
    rating: 4.6,
    reviews: 1247,
    author: { name: 'ATHLO Team', isCoach: false },
    tags: ['beginner', 'finish', 'walk-breaks', 'marathon'],
    preview: {
      philosophy: 'Conservative approach focusing on building endurance gradually with run-walk method.',
      weeklyStructure: ['Easy Run', 'Rest/Cross', 'Easy Run', 'Rest/Cross', 'Easy Run', 'Long Run', 'Rest'],
      phases: [
        { name: 'Base Building', weeks: 8 },
        { name: 'Build', weeks: 8 },
        { name: 'Peak', weeks: 2 },
        { name: 'Taper', weeks: 2 }
      ]
    }
  },
  {
    id: '3',
    name: 'HYROX Elite Performance',
    description: 'Competition-focused HYROX training combining running, functional strength, and race simulation.',
    sport: 'hyrox',
    goal: 'hyrox',
    duration: '12-16',
    weeksCount: 16,
    difficulty: 4,
    totalWorkouts: 96,
    avgWeeklyHours: 7,
    rating: 4.9,
    reviews: 89,
    author: { name: 'Coach Marcus Berg', isCoach: true },
    tags: ['hyrox', 'functional', 'competition', 'hybrid'],
    price: 79.99,
    isPro: true,
    preview: {
      philosophy: 'Periodized approach balancing running performance with functional strength and power.',
      weeklyStructure: ['HYROX Simulation', 'Strength Focus', 'Running', 'Functional', 'Running', 'Race Prep', 'Recovery'],
      phases: [
        { name: 'General Prep', weeks: 4 },
        { name: 'Specific Prep', weeks: 6 },
        { name: 'Competition', weeks: 4 },
        { name: 'Taper', weeks: 2 }
      ]
    }
  },
  {
    id: '4',
    name: 'Olympic Triathlon Plan',
    description: '12-week structured plan for Olympic distance triathlon. Balanced swim, bike, run training.',
    sport: 'triathlon',
    goal: 'triathlon',
    duration: '12-16',
    weeksCount: 12,
    difficulty: 3,
    totalWorkouts: 84,
    avgWeeklyHours: 10,
    rating: 4.7,
    reviews: 156,
    author: { name: 'Coach Emma Wilson', isCoach: true },
    tags: ['olympic', 'triathlon', 'balanced', 'intermediate'],
    price: 59.99,
    isPro: true,
    preview: {
      philosophy: 'Balanced approach across all three disciplines with brick sessions and race simulation.',
      weeklyStructure: ['Swim Tech', 'Bike Endurance', 'Run Easy', 'Swim Intervals', 'Bike Intervals', 'Brick', 'Long Run'],
      phases: [
        { name: 'Base', weeks: 4 },
        { name: 'Build', weeks: 6 },
        { name: 'Peak', weeks: 2 }
      ]
    }
  },
  {
    id: '5',
    name: 'Couch to 5K',
    description: 'Get from couch to running your first 5K in just 8 weeks. Perfect for complete beginners.',
    sport: 'running',
    goal: '5k',
    duration: '4-8',
    weeksCount: 8,
    difficulty: 1,
    totalWorkouts: 24,
    avgWeeklyHours: 2,
    rating: 4.5,
    reviews: 2341,
    author: { name: 'ATHLO Team', isCoach: false },
    tags: ['beginner', '5k', 'couch', 'walk-run'],
    preview: {
      philosophy: 'Gradual progression from walking to continuous running using proven run-walk method.',
      weeklyStructure: ['Walk/Run', 'Rest', 'Walk/Run', 'Rest', 'Walk/Run', 'Rest', 'Rest'],
      phases: [
        { name: 'Foundation', weeks: 3 },
        { name: 'Building', weeks: 3 },
        { name: 'Racing', weeks: 2 }
      ]
    }
  },
  {
    id: '6',
    name: 'Power Builder Cycling',
    description: '16-week structured power-based training to maximize FTP and climbing performance.',
    sport: 'cycling',
    goal: 'cycling',
    duration: '16-20',
    weeksCount: 16,
    difficulty: 4,
    totalWorkouts: 80,
    avgWeeklyHours: 9,
    rating: 4.8,
    reviews: 67,
    author: { name: 'Coach David Thompson', isCoach: true },
    tags: ['power', 'ftp', 'climbing', 'advanced'],
    price: 69.99,
    isPro: true,
    preview: {
      philosophy: 'Structured power training with progressive overload to maximize FTP and sustained power.',
      weeklyStructure: ['Recovery', 'Sweet Spot', 'Endurance', 'VO2max', 'Tempo', 'Endurance', 'Rest'],
      phases: [
        { name: 'Base', weeks: 6 },
        { name: 'Build', weeks: 6 },
        { name: 'Speciality', weeks: 4 }
      ]
    }
  }
];

const SPORTS: { value: Sport; label: string; icon: string }[] = [
  { value: 'running', label: 'Running', icon: '🏃‍♂️' },
  { value: 'cycling', label: 'Cycling', icon: '🚴‍♂️' },
  { value: 'triathlon', label: 'Triathlon', icon: '🏊‍♂️🚴‍♂️🏃‍♂️' },
  { value: 'swimming', label: 'Swimming', icon: '🏊‍♂️' },
  { value: 'strength', label: 'Strength', icon: '💪' },
  { value: 'hyrox', label: 'HYROX', icon: '🏋️‍♂️' }
];

const GOALS: { value: Goal; label: string }[] = [
  { value: '5k', label: '5K' },
  { value: '10k', label: '10K' },
  { value: 'half-marathon', label: 'Half Marathon' },
  { value: 'marathon', label: 'Marathon' },
  { value: 'triathlon', label: 'Triathlon' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'fitness', label: 'General Fitness' },
  { value: 'hyrox', label: 'HYROX' }
];

export default function PlanLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all');
  const [selectedGoal, setSelectedGoal] = useState<Goal | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedDuration, setSelectedDuration] = useState<Duration | 'all'>('all');
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);

  const filteredPlans = mockPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSport = selectedSport === 'all' || plan.sport === selectedSport;
    const matchesGoal = selectedGoal === 'all' || plan.goal === selectedGoal;
    const matchesDifficulty = selectedDifficulty === 'all' || plan.difficulty === selectedDifficulty;
    const matchesDuration = selectedDuration === 'all' || plan.duration === selectedDuration;
    
    return matchesSearch && matchesSport && matchesGoal && matchesDifficulty && matchesDuration;
  });

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
    return colors[difficulty - 1] || 'bg-gray-500';
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Elite'];
    return labels[difficulty - 1] || 'Unknown';
  };

  const PlanCard = ({ plan }: { plan: TrainingPlan }) => (
    <Card
      className="bg-zinc-950 border-zinc-800 hover:border-red-600/50 transition-all duration-300 cursor-pointer group"
      onClick={() => setSelectedPlan(plan)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                {plan.name}
              </h3>
              {plan.isPro && <Badge className="bg-red-600 text-white">PRO</Badge>}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{plan.description}</p>
          </div>
          {plan.price && (
            <div className="text-right">
              <div className="text-lg font-bold text-white">${plan.price}</div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{plan.weeksCount} weeks</span>
          </div>
          <div className="flex items-center gap-1">
            <Target size={16} />
            <span>{plan.totalWorkouts} workouts</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={16} />
            <span>{plan.avgWeeklyHours}h/week</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getDifficultyColor(plan.difficulty)}`}></div>
          <span className="text-sm text-gray-400">{getDifficultyLabel(plan.difficulty)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs bg-zinc-700">
                {plan.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-400">{plan.author.name}</span>
            {plan.author.isCoach && <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">Coach</Badge>}
          </div>
          
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-gray-300">{plan.rating}</span>
            <span className="text-sm text-gray-500">({plan.reviews})</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {plan.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
              {tag}
            </Badge>
          ))}
          {plan.tags.length > 3 && (
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">
              +{plan.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const PlanDetailDialog = ({ plan, onClose }: { plan: TrainingPlan; onClose: () => void }) => (
    <Dialog open={!!plan} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl text-white mb-2">{plan.name}</DialogTitle>
              <p className="text-gray-400 max-w-2xl">{plan.description}</p>
            </div>
            {plan.price && (
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">${plan.price}</div>
                <Badge className="bg-red-600 text-white">PRO Plan</Badge>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{plan.weeksCount}</div>
                <div className="text-sm text-gray-400">Weeks</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{plan.totalWorkouts}</div>
                <div className="text-sm text-gray-400">Workouts</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{plan.avgWeeklyHours}h</div>
                <div className="text-sm text-gray-400">Per Week</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{getDifficultyLabel(plan.difficulty)}</div>
                <div className="text-sm text-gray-400">Difficulty</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Author */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-zinc-700 text-white">
                    {plan.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{plan.author.name}</h3>
                    {plan.author.isCoach && <Badge className="bg-blue-600 text-white">Coach</Badge>}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-300">{plan.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{plan.reviews} reviews</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Philosophy */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Training Philosophy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{plan.preview.philosophy}</p>
            </CardContent>
          </Card>
          
          {/* Weekly Structure */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Weekly Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-3">
                {plan.preview.weeklyStructure.map((workout, i) => (
                  <div key={i} className="text-center">
                    <div className="bg-zinc-800 rounded-lg p-3 mb-2">
                      <div className="text-sm font-medium text-white mb-1">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </div>
                      <div className="text-xs text-gray-400">{workout}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Periodization */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Periodization Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.preview.phases.map((phase, i) => {
                  const totalWeeks = plan.preview.phases.reduce((acc, p) => acc + p.weeks, 0);
                  const progressPercentage = (phase.weeks / totalWeeks) * 100;
                  
                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{phase.name}</span>
                        <span className="text-gray-400 text-sm">{phase.weeks} weeks</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex gap-4">
            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              <Calendar size={16} className="mr-2" />
              Apply to Calendar
            </Button>
            <Button variant="outline" className="border-zinc-700 text-gray-300 hover:text-white">
              <Star size={16} className="mr-2" />
              Save to Favorites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Training Plan Library</h1>
          <p className="text-gray-400">Discover professionally designed training plans for every goal</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus size={16} className="mr-2" />
          Create Your Own
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            
            <Select value={selectedSport} onValueChange={(value: Sport | 'all') => setSelectedSport(value)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all" className="text-white">All Sports</SelectItem>
                {SPORTS.map(sport => (
                  <SelectItem key={sport.value} value={sport.value} className="text-white">
                    {sport.icon} {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedGoal} onValueChange={(value: Goal | 'all') => setSelectedGoal(value)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Goal" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all" className="text-white">All Goals</SelectItem>
                {GOALS.map(goal => (
                  <SelectItem key={goal.value} value={goal.value} className="text-white">
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty.toString()} onValueChange={(value) => setSelectedDifficulty(value === 'all' ? 'all' : parseInt(value) as Difficulty)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all" className="text-white">All Levels</SelectItem>
                <SelectItem value="1" className="text-white">Beginner</SelectItem>
                <SelectItem value="2" className="text-white">Novice</SelectItem>
                <SelectItem value="3" className="text-white">Intermediate</SelectItem>
                <SelectItem value="4" className="text-white">Advanced</SelectItem>
                <SelectItem value="5" className="text-white">Elite</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDuration} onValueChange={(value: Duration | 'all') => setSelectedDuration(value)}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all" className="text-white">All Durations</SelectItem>
                <SelectItem value="4-8" className="text-white">4-8 weeks</SelectItem>
                <SelectItem value="8-12" className="text-white">8-12 weeks</SelectItem>
                <SelectItem value="12-16" className="text-white">12-16 weeks</SelectItem>
                <SelectItem value="16-20" className="text-white">16-20 weeks</SelectItem>
                <SelectItem value="20+" className="text-white">20+ weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <Select defaultValue="rating">
            <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="rating" className="text-white">Rating</SelectItem>
              <SelectItem value="reviews" className="text-white">Reviews</SelectItem>
              <SelectItem value="duration" className="text-white">Duration</SelectItem>
              <SelectItem value="difficulty" className="text-white">Difficulty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map(plan => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">No plans found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search criteria or browse all plans.</p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedSport('all');
              setSelectedGoal('all');
              setSelectedDifficulty('all');
              setSelectedDuration('all');
            }}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600/10"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Plan Detail Dialog */}
      {selectedPlan && (
        <PlanDetailDialog
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}