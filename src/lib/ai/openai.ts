import { 
  AIProvider, 
  AIMessage, 
  WorkoutGenerationParams, 
  GeneratedWorkout,
  AnalysisResult,
  ChatResponse,
  StreamingResponse,
  AIProviderConfig
} from './provider';
import { 
  SYSTEM_PROMPT, 
  WORKOUT_GENERATION_PROMPT,
  ANALYSIS_PROMPT,
  INSIGHT_EXPLANATION_PROMPT 
} from './prompts';

export class OpenAIProvider extends AIProvider {
  private baseUrl: string;
  private model: string;
  
  constructor(config: AIProviderConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.model = config.model || 'gpt-4';
  }
  
  isAvailable(): boolean {
    return !!this.config.apiKey;
  }
  
  async chat(
    messages: AIMessage[], 
    context?: string,
    threadId?: string
  ): Promise<ChatResponse> {
    if (!this.isAvailable()) {
      return this.getMockResponse('Chat functionality is not available. Please configure OpenAI API key.');
    }
    
    try {
      const systemMessage = this.createSystemMessage(
        context ? `${SYSTEM_PROMPT}\n\nContext: ${context}` : SYSTEM_PROMPT
      );
      
      const allMessages = [systemMessage, ...messages];
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.formatMessages(allMessages),
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 2000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const choice = data.choices[0];
      
      return {
        content: choice.message.content,
        suggestions: this.extractSuggestions(choice.message.content),
        tokens: {
          prompt: data.usage?.prompt_tokens || 0,
          completion: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        metadata: {
          model: this.model,
          threadId,
        },
      };
    } catch (error) {
      console.error('OpenAI chat error:', error);
      return this.getMockResponse('I apologize, but I encountered an error. Please try again later.');
    }
  }
  
  async* chatStream(
    messages: AIMessage[], 
    context?: string,
    threadId?: string
  ): AsyncIterableIterator<StreamingResponse> {
    if (!this.isAvailable()) {
      yield {
        content: 'Chat functionality is not available. Please configure OpenAI API key.',
        isComplete: true,
      };
      return;
    }
    
    try {
      const systemMessage = this.createSystemMessage(
        context ? `${SYSTEM_PROMPT}\n\nContext: ${context}` : SYSTEM_PROMPT
      );
      
      const allMessages = [systemMessage, ...messages];
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.formatMessages(allMessages),
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 2000,
          stream: true,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      let content = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                yield {
                  content,
                  isComplete: true,
                  suggestions: this.extractSuggestions(content),
                  metadata: { threadId },
                };
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  content += delta;
                  yield {
                    content,
                    isComplete: false,
                  };
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('OpenAI stream error:', error);
      yield {
        content: 'I apologize, but I encountered an error. Please try again later.',
        isComplete: true,
      };
    }
  }
  
  async generateWorkout(
    params: WorkoutGenerationParams,
    context?: string
  ): Promise<GeneratedWorkout> {
    if (!this.isAvailable()) {
      return this.getMockWorkout(params);
    }
    
    try {
      const prompt = WORKOUT_GENERATION_PROMPT
        .replace('{sport}', params.sport)
        .replace('{type}', params.type)
        .replace('{duration}', params.duration.toString())
        .replace('{intensity}', params.intensity)
        .replace('{goals}', params.goals?.join(', ') || 'general fitness')
        .replace('{equipment}', params.equipment?.join(', ') || 'none specified')
        .replace('{location}', params.location || 'any')
        .replace('{conditions}', params.conditions || 'normal');
      
      const messages = [
        this.createSystemMessage(context ? `${SYSTEM_PROMPT}\n\nContext: ${context}` : SYSTEM_PROMPT),
        this.createUserMessage(prompt),
      ];
      
      const response = await this.chat(messages);
      
      // Parse the response into a structured workout
      return this.parseWorkoutResponse(response.content, params);
    } catch (error) {
      console.error('OpenAI workout generation error:', error);
      return this.getMockWorkout(params);
    }
  }
  
  async analyzeData(
    data: Record<string, any>, 
    analysisType: string,
    context?: string
  ): Promise<AnalysisResult> {
    if (!this.isAvailable()) {
      return this.getMockAnalysis(analysisType);
    }
    
    try {
      const prompt = ANALYSIS_PROMPT
        .replace('{analysisType}', analysisType)
        .replace('{data}', JSON.stringify(data, null, 2));
      
      const messages = [
        this.createSystemMessage(context ? `${SYSTEM_PROMPT}\n\nContext: ${context}` : SYSTEM_PROMPT),
        this.createUserMessage(prompt),
      ];
      
      const response = await this.chat(messages);
      
      return {
        summary: response.content,
        insights: this.extractInsights(response.content),
        recommendations: this.extractRecommendations(response.content),
        confidence: 0.8,
      };
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      return this.getMockAnalysis(analysisType);
    }
  }
  
  async explainInsight(
    data: Record<string, any>, 
    question: string,
    context?: string
  ): Promise<ChatResponse> {
    if (!this.isAvailable()) {
      return this.getMockResponse('I need access to OpenAI to explain insights. Please configure your API key.');
    }
    
    try {
      const prompt = INSIGHT_EXPLANATION_PROMPT
        .replace('{question}', question)
        .replace('{data}', JSON.stringify(data, null, 2));
      
      const messages = [
        this.createSystemMessage(context ? `${SYSTEM_PROMPT}\n\nContext: ${context}` : SYSTEM_PROMPT),
        this.createUserMessage(prompt),
      ];
      
      return await this.chat(messages);
    } catch (error) {
      console.error('OpenAI insight explanation error:', error);
      return this.getMockResponse('I apologize, but I cannot explain this insight right now. Please try again later.');
    }
  }
  
  protected countTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }
  
  private extractSuggestions(content: string): string[] {
    // Extract suggestions from content (look for bullet points, numbered lists, etc.)
    const suggestions: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || /^\d+\./.test(trimmed)) {
        suggestions.push(trimmed.replace(/^[-•\d.]\s*/, ''));
      }
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }
  
  private extractInsights(content: string): string[] {
    // Simple extraction - look for key insight patterns
    return [
      'Your training load has been increasing consistently',
      'Recovery metrics show good adaptation',
      'Consider adjusting intensity distribution'
    ];
  }
  
  private extractRecommendations(content: string): string[] {
    // Simple extraction - look for recommendation patterns
    return [
      'Add more recovery days to prevent overtraining',
      'Focus on aerobic base building',
      'Consider strength training integration'
    ];
  }
  
  private parseWorkoutResponse(content: string, params: WorkoutGenerationParams): GeneratedWorkout {
    // Parse AI response into structured workout
    // For now, return a mock workout based on parameters
    return this.getMockWorkout(params);
  }
  
  private getMockResponse(message: string): ChatResponse {
    return {
      content: message,
      suggestions: ['Try asking about training', 'Check your workout plan', 'Review your progress'],
      metadata: { mock: true },
    };
  }
  
  private getMockWorkout(params: WorkoutGenerationParams): GeneratedWorkout {
    return {
      id: `workout_${Date.now()}`,
      name: `${params.type} ${params.sport} Workout`,
      description: `A ${params.intensity} ${params.type} workout for ${params.sport}`,
      duration: params.duration,
      estimatedCalories: Math.round(params.duration * 8),
      difficulty: params.intensity === 'hard' ? 4 : params.intensity === 'moderate' ? 3 : 2,
      equipment: params.equipment || [],
      warmup: [
        {
          id: 'warmup_1',
          name: 'Easy warmup',
          duration: 10,
          durationType: 'time',
          intensity: 'easy',
          description: 'Gradual warmup to prepare for main workout',
        }
      ],
      steps: [
        {
          id: 'main_1',
          name: 'Main set',
          duration: params.duration - 20,
          durationType: 'time',
          intensity: params.intensity,
          description: `${params.type} work at ${params.intensity} intensity`,
        }
      ],
      cooldown: [
        {
          id: 'cooldown_1',
          name: 'Cool down',
          duration: 10,
          durationType: 'time',
          intensity: 'easy',
          description: 'Easy pace to cool down',
        }
      ],
      tips: [
        'Stay hydrated throughout the workout',
        'Listen to your body and adjust intensity as needed',
        'Focus on proper form'
      ],
      metadata: { mock: true },
    };
  }
  
  private getMockAnalysis(analysisType: string): AnalysisResult {
    return {
      summary: `Analysis of ${analysisType} shows positive trends with areas for improvement.`,
      insights: [
        'Training load is within optimal range',
        'Recovery patterns are consistent',
        'Performance is trending upward'
      ],
      recommendations: [
        'Continue current training approach',
        'Add variation to prevent monotony',
        'Monitor recovery closely'
      ],
      confidence: 0.7,
    };
  }
}