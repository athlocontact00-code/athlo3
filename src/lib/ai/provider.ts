export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface WorkoutGenerationParams {
  sport: string;
  type: 'endurance' | 'interval' | 'tempo' | 'recovery' | 'strength' | 'race';
  duration: number; // minutes
  intensity: 'easy' | 'moderate' | 'hard' | 'recovery';
  goals?: string[];
  equipment?: string[];
  location?: 'indoor' | 'outdoor';
  conditions?: string;
}

export interface WorkoutStep {
  id: string;
  name: string;
  duration: number; // minutes or distance
  durationType: 'time' | 'distance' | 'reps';
  intensity: string;
  description: string;
  targetZone?: string;
  notes?: string;
}

export interface GeneratedWorkout {
  id: string;
  name: string;
  description: string;
  duration: number;
  estimatedCalories: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  equipment: string[];
  steps: WorkoutStep[];
  warmup: WorkoutStep[];
  cooldown: WorkoutStep[];
  tips: string[];
  metadata?: Record<string, any>;
}

export interface AnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
  riskFactors?: string[];
  predictions?: Record<string, any>;
  confidence: number; // 0-1
}

export interface ChatResponse {
  content: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface StreamingResponse {
  content: string;
  isComplete: boolean;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export interface AIProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export abstract class AIProvider {
  protected config: AIProviderConfig;
  
  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract isAvailable(): boolean;
  
  abstract chat(
    messages: AIMessage[], 
    context?: string,
    threadId?: string
  ): Promise<ChatResponse>;
  
  abstract chatStream(
    messages: AIMessage[], 
    context?: string,
    threadId?: string
  ): AsyncIterableIterator<StreamingResponse>;
  
  abstract generateWorkout(
    params: WorkoutGenerationParams,
    context?: string
  ): Promise<GeneratedWorkout>;
  
  abstract analyzeData(
    data: Record<string, any>, 
    analysisType: string,
    context?: string
  ): Promise<AnalysisResult>;
  
  abstract explainInsight(
    data: Record<string, any>, 
    question: string,
    context?: string
  ): Promise<ChatResponse>;
  
  protected abstract countTokens(text: string): number;
  
  protected formatMessages(messages: AIMessage[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }
  
  protected createSystemMessage(prompt: string): AIMessage {
    return {
      role: 'system',
      content: prompt,
      timestamp: new Date(),
    };
  }
  
  protected createUserMessage(content: string): AIMessage {
    return {
      role: 'user',
      content,
      timestamp: new Date(),
    };
  }
  
  protected createAssistantMessage(content: string): AIMessage {
    return {
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
  }
}

// Factory function to get the configured AI provider
export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || 'openai';
  
  switch (provider.toLowerCase()) {
    case 'openai':
      const OpenAIProvider = require('./openai').OpenAIProvider;
      return new OpenAIProvider({
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4',
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000'),
      });
    
    // Add other providers here (Claude, Gemini, etc.)
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

// Utility to check if AI features are available
export function isAIAvailable(): boolean {
  try {
    const provider = getAIProvider();
    return provider.isAvailable();
  } catch {
    return false;
  }
}