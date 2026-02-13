import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider, isAIAvailable } from '@/lib/ai/provider';
import { AIContextBuilder, createMockContext } from '@/lib/ai/context';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      sport, 
      type, 
      duration, 
      intensity, 
      goals = [], 
      equipment = [],
      location = 'any',
      conditions = 'normal',
      includeContext = true
    } = body;

    // Validate required parameters
    if (!sport || !type || !duration || !intensity) {
      return NextResponse.json(
        { error: 'Missing required fields: sport, type, duration, intensity' },
        { status: 400 }
      );
    }

    // Validate parameter values
    if (!['endurance', 'interval', 'tempo', 'recovery', 'strength', 'race'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid workout type' },
        { status: 400 }
      );
    }

    if (!['easy', 'moderate', 'hard', 'recovery'].includes(intensity)) {
      return NextResponse.json(
        { error: 'Invalid intensity level' },
        { status: 400 }
      );
    }

    if (duration < 15 || duration > 300) {
      return NextResponse.json(
        { error: 'Duration must be between 15 and 300 minutes' },
        { status: 400 }
      );
    }

    // Check if AI is available
    if (!isAIAvailable()) {
      // Return a mock workout when AI is not available
      const mockWorkout = {
        id: `workout_${Date.now()}`,
        name: `${type} ${sport} Workout`,
        description: `A ${intensity} ${type} workout for ${sport} lasting ${duration} minutes`,
        duration: duration,
        estimatedCalories: Math.round(duration * 8),
        difficulty: intensity === 'hard' ? 4 : intensity === 'moderate' ? 3 : 2,
        equipment: equipment,
        warmup: [
          {
            id: 'warmup_1',
            name: 'Dynamic warmup',
            duration: Math.max(5, Math.round(duration * 0.15)),
            durationType: 'time',
            intensity: 'easy',
            description: 'Gradual warmup to prepare your body for the main workout',
          }
        ],
        steps: [
          {
            id: 'main_1',
            name: `${type} main set`,
            duration: duration - Math.max(10, Math.round(duration * 0.3)),
            durationType: 'time',
            intensity: intensity,
            description: `${type} work at ${intensity} intensity. Focus on maintaining good form throughout.`,
            targetZone: intensity === 'hard' ? 'Zone 4-5' : intensity === 'moderate' ? 'Zone 2-3' : 'Zone 1-2',
          }
        ],
        cooldown: [
          {
            id: 'cooldown_1',
            name: 'Cool down',
            duration: Math.max(5, Math.round(duration * 0.15)),
            durationType: 'time',
            intensity: 'easy',
            description: 'Easy pace to gradually bring your heart rate down',
          }
        ],
        tips: [
          'Stay hydrated throughout the workout',
          'Listen to your body and adjust intensity as needed',
          'Focus on proper form and technique',
          intensity === 'hard' ? 'Push yourself but maintain control' : 'Keep effort conversational',
        ],
        metadata: { 
          demo: true,
          generated: new Date().toISOString(),
          parameters: { sport, type, duration, intensity }
        },
      };

      return NextResponse.json(mockWorkout);
    }

    const provider = getAIProvider();

    // Build context if requested
    let context = '';
    if (includeContext) {
      // In a real app, this would come from the database based on the user session
      const contextBuilder = createMockContext();
      context = contextBuilder.buildContext();
    }

    // Generate workout using AI
    const workout = await provider.generateWorkout({
      sport,
      type,
      duration,
      intensity,
      goals,
      equipment,
      location,
      conditions,
    }, context);

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Workout generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout' },
      { status: 500 }
    );
  }
}