import { CONTEXT_TEMPLATES } from './prompts';

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  sport: string;
  experience?: string;
  goals?: string[];
  trainingHistory?: string;
}

export interface Workout {
  id: string;
  date: string;
  sport: string;
  type: string;
  duration: number;
  intensity?: string;
  tss?: number;
  rpe?: number;
  notes?: string;
  completed: boolean;
}

export interface CheckIn {
  date: string;
  hrv?: number;
  sleepHours?: number;
  sleepQuality?: number;
  stress?: number;
  motivation?: number;
  mood?: number;
  readiness?: number;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  currentPhase: string;
  weeklyStructure: string;
  keySessions: string[];
  nextRace?: {
    name: string;
    date: string;
    distance: string;
  };
}

export interface PerformanceMetrics {
  ctl: number; // Chronic Training Load
  atl: number; // Acute Training Load
  tsb: number; // Training Stress Balance
  recentPRs: string[];
}

export interface ContextData {
  profile: UserProfile;
  recentWorkouts: Workout[];
  recentCheckIns: CheckIn[];
  trainingPlan?: TrainingPlan;
  metrics?: PerformanceMetrics;
}

export interface ContextWindow {
  days: number;
  includeProfile: boolean;
  includeWorkouts: boolean;
  includeCheckIns: boolean;
  includeMetrics: boolean;
  includePlan: boolean;
}

export class AIContextBuilder {
  private data: Partial<ContextData>;
  
  constructor(data: Partial<ContextData> = {}) {
    this.data = data;
  }
  
  setProfile(profile: UserProfile): AIContextBuilder {
    this.data.profile = profile;
    return this;
  }
  
  setWorkouts(workouts: Workout[]): AIContextBuilder {
    this.data.recentWorkouts = workouts;
    return this;
  }
  
  setCheckIns(checkIns: CheckIn[]): AIContextBuilder {
    this.data.recentCheckIns = checkIns;
    return this;
  }
  
  setTrainingPlan(plan: TrainingPlan): AIContextBuilder {
    this.data.trainingPlan = plan;
    return this;
  }
  
  setMetrics(metrics: PerformanceMetrics): AIContextBuilder {
    this.data.metrics = metrics;
    return this;
  }
  
  buildContext(window: ContextWindow = DEFAULT_CONTEXT_WINDOW): string {
    const contextParts: string[] = [];
    
    // Add profile information
    if (window.includeProfile && this.data.profile) {
      contextParts.push(this.buildProfileContext(this.data.profile));
    }
    
    // Add recent workouts
    if (window.includeWorkouts && this.data.recentWorkouts) {
      const filteredWorkouts = this.filterByDays(this.data.recentWorkouts, window.days);
      if (filteredWorkouts.length > 0) {
        contextParts.push(this.buildWorkoutsContext(filteredWorkouts));
      }
    }
    
    // Add recent check-ins
    if (window.includeCheckIns && this.data.recentCheckIns) {
      const filteredCheckIns = this.filterCheckInsByDays(this.data.recentCheckIns, window.days);
      if (filteredCheckIns.length > 0) {
        contextParts.push(this.buildCheckInsContext(filteredCheckIns));
      }
    }
    
    // Add training plan
    if (window.includePlan && this.data.trainingPlan) {
      contextParts.push(this.buildPlanContext(this.data.trainingPlan));
    }
    
    // Add performance metrics
    if (window.includeMetrics && this.data.metrics) {
      contextParts.push(this.buildMetricsContext(this.data.metrics));
    }
    
    return contextParts.join('\n\n');
  }
  
  buildSummary(window: ContextWindow = DEFAULT_CONTEXT_WINDOW): string {
    const context = this.buildContext(window);
    
    // Create a condensed summary for token efficiency
    const summary: string[] = [];
    
    if (this.data.profile) {
      summary.push(`Athlete: ${this.data.profile.name} (${this.data.profile.sport})`);
    }
    
    if (this.data.recentWorkouts) {
      const recentWorkouts = this.filterByDays(this.data.recentWorkouts, window.days);
      const totalHours = recentWorkouts.reduce((sum, w) => sum + w.duration, 0) / 60;
      const avgTSS = recentWorkouts.reduce((sum, w) => sum + (w.tss || 0), 0) / recentWorkouts.length;
      summary.push(`Last ${window.days} days: ${recentWorkouts.length} workouts, ${totalHours.toFixed(1)}h, avg TSS ${avgTSS.toFixed(0)}`);
    }
    
    if (this.data.recentCheckIns) {
      const recentCheckIns = this.filterCheckInsByDays(this.data.recentCheckIns, window.days);
      const avgReadiness = recentCheckIns.reduce((sum, c) => sum + (c.readiness || 0), 0) / recentCheckIns.length;
      const avgHRV = recentCheckIns.reduce((sum, c) => sum + (c.hrv || 0), 0) / recentCheckIns.length;
      summary.push(`Recovery: Readiness ${avgReadiness.toFixed(1)}/10, HRV ${avgHRV.toFixed(0)}`);
    }
    
    return summary.join(' | ');
  }
  
  private buildProfileContext(profile: UserProfile): string {
    return CONTEXT_TEMPLATES.ATHLETE_PROFILE
      .replace('{name}', profile.name)
      .replace('{age}', profile.age?.toString() || 'Not specified')
      .replace('{sport}', profile.sport)
      .replace('{experience}', profile.experience || 'Not specified')
      .replace('{goals}', profile.goals?.join(', ') || 'Not specified')
      .replace('{trainingHistory}', profile.trainingHistory || 'Not specified');
  }
  
  private buildWorkoutsContext(workouts: Workout[]): string {
    const workoutSummaries = workouts.map(w => {
      const completionStatus = w.completed ? '✓' : '✗';
      const rpeStr = w.rpe ? ` (RPE: ${w.rpe})` : '';
      const tssStr = w.tss ? ` (TSS: ${w.tss})` : '';
      return `${completionStatus} ${w.date}: ${w.type} ${w.sport} - ${w.duration}min${rpeStr}${tssStr}`;
    }).join('\n');
    
    return CONTEXT_TEMPLATES.RECENT_WORKOUTS
      .replace('{recentWorkouts}', workoutSummaries);
  }
  
  private buildCheckInsContext(checkIns: CheckIn[]): string {
    const avgHRV = this.average(checkIns.map(c => c.hrv).filter((value): value is number => value !== undefined));
    const avgSleep = this.average(checkIns.map(c => c.sleepHours).filter((value): value is number => value !== undefined));
    const avgReadiness = this.average(checkIns.map(c => c.readiness).filter((value): value is number => value !== undefined));
    const healthIssues = checkIns
      .filter(c => c.notes?.includes('injury') || c.notes?.includes('sick') || c.notes?.includes('pain'))
      .map(c => `${c.date}: ${c.notes}`)
      .join(', ') || 'None reported';
    
    return CONTEXT_TEMPLATES.HEALTH_METRICS
      .replace('{hrv}', avgHRV?.toFixed(0) || 'N/A')
      .replace('{sleep}', avgSleep?.toFixed(1) || 'N/A')
      .replace('{readiness}', avgReadiness?.toFixed(1) || 'N/A')
      .replace('{healthIssues}', healthIssues);
  }
  
  private buildPlanContext(plan: TrainingPlan): string {
    const nextRaceStr = plan.nextRace 
      ? `${plan.nextRace.name} (${plan.nextRace.date}) - ${plan.nextRace.distance}`
      : 'None scheduled';
      
    return CONTEXT_TEMPLATES.TRAINING_PLAN
      .replace('{currentPhase}', plan.currentPhase)
      .replace('{weeklyStructure}', plan.weeklyStructure)
      .replace('{keySessions}', plan.keySessions.join(', '))
      .replace('{nextRace}', nextRaceStr);
  }
  
  private buildMetricsContext(metrics: PerformanceMetrics): string {
    return CONTEXT_TEMPLATES.PERFORMANCE_METRICS
      .replace('{ctl}', metrics.ctl.toString())
      .replace('{atl}', metrics.atl.toString())
      .replace('{tsb}', metrics.tsb.toString())
      .replace('{recentPRs}', metrics.recentPRs.join(', ') || 'None recent');
  }
  
  private filterByDays(workouts: Workout[], days: number): Workout[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return workouts.filter(w => new Date(w.date) >= cutoffDate);
  }
  
  private filterCheckInsByDays(checkIns: CheckIn[], days: number): CheckIn[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return checkIns.filter(c => new Date(c.date) >= cutoffDate);
  }
  
  private average(numbers: number[]): number | null {
    if (numbers.length === 0) return null;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }
  
  // Token counting and optimization
  estimateTokens(): number {
    const context = this.buildContext();
    return Math.ceil(context.length / 4); // Rough estimation
  }
  
  optimizeForTokenLimit(maxTokens: number): string {
    // Start with full context and reduce until under token limit
    let window = { ...DEFAULT_CONTEXT_WINDOW };
    
    while (this.estimateTokens() > maxTokens && window.days > 1) {
      window.days = Math.max(1, window.days - 1);
      if (this.estimateTokens() > maxTokens && window.includeWorkouts) {
        window.includeWorkouts = false;
      }
      if (this.estimateTokens() > maxTokens && window.includeCheckIns) {
        window.includeCheckIns = false;
      }
    }
    
    return this.buildContext(window);
  }
}

export const DEFAULT_CONTEXT_WINDOW: ContextWindow = {
  days: 14,
  includeProfile: true,
  includeWorkouts: true,
  includeCheckIns: true,
  includeMetrics: true,
  includePlan: true,
};

export const SHORT_CONTEXT_WINDOW: ContextWindow = {
  days: 7,
  includeProfile: true,
  includeWorkouts: true,
  includeCheckIns: true,
  includeMetrics: false,
  includePlan: false,
};

export const MINIMAL_CONTEXT_WINDOW: ContextWindow = {
  days: 3,
  includeProfile: true,
  includeWorkouts: false,
  includeCheckIns: false,
  includeMetrics: false,
  includePlan: false,
};

// Utility functions for creating context from mock data
export function createMockContext(): AIContextBuilder {
  return new AIContextBuilder({
    profile: {
      id: 'user_1',
      name: 'John Doe',
      age: 32,
      sport: 'Running',
      experience: '5 years',
      goals: ['Sub-3 marathon', 'Stay injury-free'],
      trainingHistory: 'Consistent runner with 3 marathons completed',
    },
    recentWorkouts: [
      {
        id: 'w1',
        date: new Date().toISOString().split('T')[0],
        sport: 'Running',
        type: 'Easy Run',
        duration: 45,
        intensity: 'easy',
        tss: 35,
        rpe: 6,
        completed: true,
      },
      {
        id: 'w2',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        sport: 'Running',
        type: 'Interval Training',
        duration: 60,
        intensity: 'hard',
        tss: 75,
        rpe: 8,
        completed: true,
      },
    ],
    recentCheckIns: [
      {
        date: new Date().toISOString().split('T')[0],
        hrv: 45,
        sleepHours: 7.5,
        sleepQuality: 8,
        stress: 4,
        motivation: 8,
        mood: 7,
        readiness: 7,
      },
    ],
    trainingPlan: {
      id: 'plan_1',
      name: 'Marathon Training',
      currentPhase: 'Build Phase',
      weeklyStructure: '6 days/week with long run on Sunday',
      keySessions: ['Long Run', 'Tempo Run', 'Intervals'],
      nextRace: {
        name: 'City Marathon',
        date: '2024-04-15',
        distance: '42.2K',
      },
    },
    metrics: {
      ctl: 65,
      atl: 70,
      tsb: -5,
      recentPRs: ['5K: 19:45', '10K: 41:30'],
    },
  });
}