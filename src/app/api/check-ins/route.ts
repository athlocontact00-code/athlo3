import { NextResponse } from 'next/server'

// Mock check-in data
const mockCheckIns = [
  {
    id: '1',
    date: new Date().toISOString(),
    readiness: 78,
    hrv: 45,
    hrvTrend: 'stable',
    sleepHours: 7.5,
    sleepQuality: 4,
    stress: 4,
    mood: 4,
    weight: 75.2,
    notes: 'Czuję się dobrze, gotowy na trening'
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(),
    readiness: 82,
    hrv: 48,
    hrvTrend: 'up',
    sleepHours: 8,
    sleepQuality: 5,
    stress: 3,
    mood: 5,
    weight: 75.0,
    notes: 'Świetny sen, pełen energii'
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockCheckIns
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch check-ins' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newCheckIn = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...body
    }
    
    mockCheckIns.push(newCheckIn)
    
    return NextResponse.json({
      success: true,
      data: newCheckIn
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create check-in' },
      { status: 500 }
    )
  }
}