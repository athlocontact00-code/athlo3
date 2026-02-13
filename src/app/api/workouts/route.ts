import { NextResponse } from 'next/server'

// Mock workout data
const mockWorkouts = [
  {
    id: '1',
    sport: 'running',
    name: 'Morning Easy Run',
    type: 'Easy Run',
    duration: '45 min',
    distance: '7-8 km',
    intensity: 'easy',
    status: 'planned',
    date: new Date().toISOString(),
    load: 35
  },
  {
    id: '2', 
    sport: 'cycling',
    name: 'Tempo Ride',
    type: 'Tempo Ride',
    duration: '90 min',
    distance: '45 km',
    intensity: 'moderate',
    status: 'completed',
    date: new Date(Date.now() - 86400000).toISOString(),
    load: 95
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockWorkouts
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newWorkout = {
      id: Date.now().toString(),
      ...body,
      date: new Date().toISOString()
    }
    
    mockWorkouts.push(newWorkout)
    
    return NextResponse.json({
      success: true,
      data: newWorkout
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create workout' },
      { status: 500 }
    )
  }
}