'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell,
  Timer,
  Bike,
  Footprints,
  Waves,
  Users2,
  Trophy,
  Sword,
  Mountain,
  CircleDot,
  Flame,
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sport {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  isPopular?: boolean;
}

const sports: Sport[] = [
  // Popular sports (will be shown first)
  { id: 'running', icon: Footprints, name: 'Running', isPopular: true },
  { id: 'cycling', icon: Bike, name: 'Cycling', isPopular: true },
  { id: 'swimming', icon: Waves, name: 'Swimming', isPopular: true },
  { id: 'football', icon: Users2, name: 'Football', isPopular: true },
  { id: 'crossfit', icon: Dumbbell, name: 'CrossFit', isPopular: true },
  { id: 'gym-strength', icon: Dumbbell, name: 'Gym/Strength', isPopular: true },
  { id: 'hyrox', icon: Timer, name: 'HYROX', isPopular: true },
  { id: 'triathlon', icon: Activity, name: 'Triathlon', isPopular: true },
  
  // Full alphabetical list
  { id: 'basketball', icon: Trophy, name: 'Basketball' },
  { id: 'boxing', icon: Sword, name: 'Boxing' },
  { id: 'climbing', icon: Mountain, name: 'Climbing' },
  { id: 'cricket', icon: Trophy, name: 'Cricket' },
  { id: 'dance', icon: Flame, name: 'Dance' },
  { id: 'duathlon', icon: Activity, name: 'Duathlon' },
  { id: 'fencing', icon: Sword, name: 'Fencing' },
  { id: 'golf', icon: CircleDot, name: 'Golf' },
  { id: 'gymnastics', icon: Flame, name: 'Gymnastics' },
  { id: 'handball', icon: Users2, name: 'Handball' },
  { id: 'hockey', icon: Users2, name: 'Hockey' },
  { id: 'ice-skating', icon: Footprints, name: 'Ice Skating' },
  { id: 'judo', icon: Sword, name: 'Judo' },
  { id: 'karate', icon: Sword, name: 'Karate' },
  { id: 'kayaking', icon: Waves, name: 'Kayaking' },
  { id: 'kickboxing', icon: Sword, name: 'Kickboxing' },
  { id: 'mma', icon: Sword, name: 'MMA' },
  { id: 'martial-arts', icon: Sword, name: 'Martial Arts' },
  { id: 'mountain-biking', icon: Bike, name: 'Mountain Biking' },
  { id: 'padel', icon: CircleDot, name: 'Padel' },
  { id: 'pilates', icon: Flame, name: 'Pilates' },
  { id: 'powerlifting', icon: Dumbbell, name: 'Powerlifting' },
  { id: 'rock-climbing', icon: Mountain, name: 'Rock Climbing' },
  { id: 'rowing', icon: Waves, name: 'Rowing' },
  { id: 'rugby', icon: Users2, name: 'Rugby' },
  { id: 'sailing', icon: Waves, name: 'Sailing' },
  { id: 'skateboarding', icon: Footprints, name: 'Skateboarding' },
  { id: 'skiing', icon: Footprints, name: 'Skiing' },
  { id: 'snowboarding', icon: Footprints, name: 'Snowboarding' },
  { id: 'squash', icon: CircleDot, name: 'Squash' },
  { id: 'surfing', icon: Waves, name: 'Surfing' },
  { id: 'table-tennis', icon: CircleDot, name: 'Table Tennis' },
  { id: 'taekwondo', icon: Sword, name: 'Taekwondo' },
  { id: 'tennis', icon: CircleDot, name: 'Tennis' },
  { id: 'track-field', icon: Footprints, name: 'Track & Field' },
  { id: 'trail-running', icon: Mountain, name: 'Trail Running' },
  { id: 'volleyball', icon: Users2, name: 'Volleyball' },
  { id: 'walking', icon: Footprints, name: 'Walking' },
  { id: 'water-polo', icon: Waves, name: 'Water Polo' },
  { id: 'wrestling', icon: Sword, name: 'Wrestling' },
  { id: 'yoga', icon: Flame, name: 'Yoga' },
];

interface SportSelectorProps {
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
  multiSelect?: boolean;
  className?: string;
  placeholder?: string;
}

export function SportSelector({ 
  selectedSports = [], 
  onSportsChange, 
  multiSelect = true,
  className = "",
  placeholder = "Search sports..."
}: SportSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [customSport, setCustomSport] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSports, setCustomSports] = useState<string[]>([]);

  const popularSports = sports.filter(sport => sport.isPopular);
  const allSports = sports.filter(sport => !sport.isPopular).sort((a, b) => a.name.localeCompare(b.name));

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSportToggle = (sportId: string) => {
    if (multiSelect) {
      if (selectedSports.includes(sportId)) {
        onSportsChange(selectedSports.filter(id => id !== sportId));
      } else {
        onSportsChange([...selectedSports, sportId]);
      }
    } else {
      onSportsChange([sportId]);
    }
  };

  const handleCustomSportAdd = () => {
    if (customSport.trim() && !customSports.includes(customSport.trim())) {
      const newCustomSports = [...customSports, customSport.trim()];
      setCustomSports(newCustomSports);
      if (multiSelect) {
        onSportsChange([...selectedSports, customSport.trim()]);
      } else {
        onSportsChange([customSport.trim()]);
      }
      setCustomSport('');
      setShowCustomInput(false);
    }
  };

  const removeCustomSport = (sport: string) => {
    setCustomSports(customSports.filter(s => s !== sport));
    onSportsChange(selectedSports.filter(s => s !== sport));
  };

  const SportButton = ({ sport, isCustom = false }: { sport: Sport | { id: string; name: string }, isCustom?: boolean }) => {
    const Icon = 'icon' in sport ? sport.icon : Plus;
    const isSelected = selectedSports.includes(sport.id);
    
    return (
      <motion.button
        type="button"
        onClick={() => handleSportToggle(sport.id)}
        className={`relative p-3 rounded-lg border-2 transition-all text-sm flex items-center gap-2 min-w-0 ${
          isSelected
            ? 'border-primary bg-primary/10 text-primary shadow-sm'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{sport.name}</span>
        {isCustom && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeCustomSport(sport.id);
            }}
            className="ml-auto p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </motion.button>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Show filtered results when searching */}
      {searchTerm && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Search Results</h4>
          <div className="grid grid-cols-2 gap-2">
            {filteredSports.length > 0 ? (
              filteredSports.map((sport) => (
                <SportButton key={sport.id} sport={sport} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-2 text-center py-4">
                No sports found. Try adding a custom sport below.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Popular Sports (only when not searching) */}
      {!searchTerm && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Popular Sports</h4>
          <div className="grid grid-cols-2 gap-2">
            {popularSports.map((sport) => (
              <SportButton key={sport.id} sport={sport} />
            ))}
          </div>
        </div>
      )}

      {/* Show All Sports Toggle (only when not searching) */}
      {!searchTerm && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="text-sm"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show All Sports
              </>
            )}
          </Button>
        </div>
      )}

      {/* All Sports (expandable, only when not searching) */}
      <AnimatePresence>
        {!searchTerm && showAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">All Sports</h4>
              <div className="grid grid-cols-2 gap-2">
                {allSports.map((sport) => (
                  <SportButton key={sport.id} sport={sport} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Sports */}
      {customSports.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Your Sports</h4>
          <div className="grid grid-cols-2 gap-2">
            {customSports.map((sportName) => (
              <SportButton 
                key={sportName} 
                sport={{ id: sportName, name: sportName }} 
                isCustom 
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Sport */}
      <div className="space-y-2">
        {!showCustomInput ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCustomInput(true)}
            className="w-full justify-center text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your Sport
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter sport name..."
              value={customSport}
              onChange={(e) => setCustomSport(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCustomSportAdd();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleCustomSportAdd}
              disabled={!customSport.trim()}
              size="sm"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowCustomInput(false);
                setCustomSport('');
              }}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Selected Sports Summary */}
      {multiSelect && selectedSports.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Selected ({selectedSports.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSports.map((sportId) => {
              const sport = sports.find(s => s.id === sportId);
              const sportName = sport ? sport.name : sportId;
              return (
                <Badge
                  key={sportId}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => handleSportToggle(sportId)}
                >
                  {sportName}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}