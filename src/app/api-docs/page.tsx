'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight,
  Code,
  Key,
  Lock,
  Globe,
  Copy,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/common/logo';
import { cn } from '@/lib/utils';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  auth: boolean;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  requestBody?: string;
  responseExample: string;
}

interface ApiGroup {
  id: string;
  title: string;
  description: string;
  endpoints: ApiEndpoint[];
}

const apiGroups: ApiGroup[] = [
  {
    id: 'auth',
    title: 'Authentication',
    description: 'User authentication and session management',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/login',
        title: 'Login User',
        description: 'Authenticate user with email and password',
        auth: false,
        requestBody: `{
  "email": "athlete@example.com",
  "password": "securepassword"
}`,
        responseExample: `{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "athlete@example.com",
    "name": "John Doe",
    "role": "athlete"
  },
  "token": "jwt_token_here"
}`
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        title: 'Logout User',
        description: 'Invalidate current session',
        auth: true,
        responseExample: `{
  "success": true,
  "message": "Successfully logged out"
}`
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        title: 'Get Current User',
        description: 'Get currently authenticated user information',
        auth: true,
        responseExample: `{
  "user": {
    "id": "user_123",
    "email": "athlete@example.com",
    "name": "John Doe",
    "role": "athlete",
    "profile": {
      "sport": "Running",
      "experience": "Intermediate"
    }
  }
}`
      }
    ]
  },
  {
    id: 'workouts',
    title: 'Workouts',
    description: 'Manage training workouts and plans',
    endpoints: [
      {
        method: 'GET',
        path: '/api/workouts',
        title: 'List Workouts',
        description: 'Get paginated list of user workouts',
        auth: true,
        parameters: [
          { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
          { name: 'limit', type: 'integer', required: false, description: 'Items per page (default: 20)' },
          { name: 'sport', type: 'string', required: false, description: 'Filter by sport' },
          { name: 'completed', type: 'boolean', required: false, description: 'Filter by completion status' }
        ],
        responseExample: `{
  "workouts": [
    {
      "id": "workout_123",
      "name": "Easy Run",
      "sport": "Running",
      "date": "2024-02-12",
      "duration": 45,
      "completed": true,
      "tss": 35,
      "rpe": 6
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}`
      },
      {
        method: 'POST',
        path: '/api/workouts',
        title: 'Create Workout',
        description: 'Create a new workout',
        auth: true,
        requestBody: `{
  "name": "Tempo Run",
  "sport": "Running",
  "date": "2024-02-13",
  "duration": 60,
  "type": "tempo",
  "intensity": "moderate",
  "description": "20min tempo at threshold pace"
}`,
        responseExample: `{
  "workout": {
    "id": "workout_124",
    "name": "Tempo Run",
    "sport": "Running",
    "date": "2024-02-13",
    "duration": 60,
    "completed": false,
    "createdAt": "2024-02-12T10:30:00Z"
  }
}`
      },
      {
        method: 'PUT',
        path: '/api/workouts/{id}',
        title: 'Update Workout',
        description: 'Update an existing workout',
        auth: true,
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Workout ID' }
        ],
        requestBody: `{
  "completed": true,
  "tss": 65,
  "rpe": 8,
  "notes": "Felt strong throughout the workout"
}`,
        responseExample: `{
  "workout": {
    "id": "workout_124",
    "name": "Tempo Run",
    "completed": true,
    "tss": 65,
    "rpe": 8,
    "updatedAt": "2024-02-13T08:45:00Z"
  }
}`
      }
    ]
  },
  {
    id: 'checkins',
    title: 'Check-ins',
    description: 'Daily wellness and readiness check-ins',
    endpoints: [
      {
        method: 'POST',
        path: '/api/check-ins',
        title: 'Create Check-in',
        description: 'Record daily wellness metrics',
        auth: true,
        requestBody: `{
  "date": "2024-02-12",
  "hrv": 45,
  "sleepHours": 7.5,
  "sleepQuality": 8,
  "stress": 3,
  "motivation": 8,
  "mood": 7,
  "readiness": 8,
  "notes": "Feeling great after good sleep"
}`,
        responseExample: `{
  "checkin": {
    "id": "checkin_123",
    "date": "2024-02-12",
    "hrv": 45,
    "readiness": 8,
    "overallScore": 7.6,
    "createdAt": "2024-02-12T07:30:00Z"
  }
}`
      },
      {
        method: 'GET',
        path: '/api/check-ins',
        title: 'Get Check-ins',
        description: 'Retrieve user check-in history',
        auth: true,
        parameters: [
          { name: 'startDate', type: 'string', required: false, description: 'Start date (YYYY-MM-DD)' },
          { name: 'endDate', type: 'string', required: false, description: 'End date (YYYY-MM-DD)' }
        ],
        responseExample: `{
  "checkins": [
    {
      "id": "checkin_123",
      "date": "2024-02-12",
      "hrv": 45,
      "sleepHours": 7.5,
      "readiness": 8,
      "overallScore": 7.6
    }
  ],
  "summary": {
    "avgReadiness": 7.8,
    "avgHRV": 46,
    "totalCheckins": 30
  }
}`
      }
    ]
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'Team communication and messaging',
    endpoints: [
      {
        method: 'GET',
        path: '/api/messages/threads',
        title: 'Get Message Threads',
        description: 'List user message threads',
        auth: true,
        responseExample: `{
  "threads": [
    {
      "id": "thread_123",
      "name": "Coach Discussion",
      "participants": [
        {
          "id": "user_123",
          "name": "John Doe",
          "role": "athlete"
        },
        {
          "id": "coach_456",
          "name": "Sarah Johnson",
          "role": "coach"
        }
      ],
      "lastMessage": {
        "content": "Great job on today's workout!",
        "timestamp": "2024-02-12T15:30:00Z",
        "sender": "Sarah Johnson"
      },
      "unreadCount": 2
    }
  ]
}`
      },
      {
        method: 'POST',
        path: '/api/messages',
        title: 'Send Message',
        description: 'Send a message to a thread',
        auth: true,
        requestBody: `{
  "threadId": "thread_123",
  "content": "Thanks for the feedback on my race strategy!"
}`,
        responseExample: `{
  "message": {
    "id": "message_789",
    "content": "Thanks for the feedback on my race strategy!",
    "senderId": "user_123",
    "threadId": "thread_123",
    "timestamp": "2024-02-12T16:45:00Z"
  }
}`
      }
    ]
  },
  {
    id: 'ai-coach',
    title: 'AI Coach',
    description: 'AI-powered coaching and insights',
    endpoints: [
      {
        method: 'POST',
        path: '/api/ai-coach',
        title: 'Chat with AI Coach',
        description: 'Send message to AI coach and get response',
        auth: true,
        requestBody: `{
  "message": "How should I prepare for my upcoming 10K race?",
  "threadId": "ai_thread_123",
  "includeContext": true
}`,
        responseExample: `{
  "content": "Based on your recent training data, I recommend focusing on...",
  "suggestions": [
    "Review your training plan",
    "Check your recovery metrics", 
    "Plan your race strategy"
  ],
  "metadata": {
    "model": "gpt-4",
    "tokens": {
      "total": 150
    }
  }
}`
      },
      {
        method: 'POST',
        path: '/api/ai-coach/generate-workout',
        title: 'Generate Workout',
        description: 'AI-generated workout based on parameters',
        auth: true,
        requestBody: `{
  "sport": "Running",
  "type": "interval",
  "duration": 45,
  "intensity": "hard",
  "goals": ["Improve VO2 max", "Race preparation"]
}`,
        responseExample: `{
  "workout": {
    "id": "generated_workout_123",
    "name": "VO2 Max Intervals",
    "description": "High-intensity intervals to boost aerobic power",
    "duration": 45,
    "steps": [
      {
        "name": "Warmup",
        "duration": 10,
        "intensity": "easy",
        "description": "Easy pace warmup"
      },
      {
        "name": "Main Set",
        "duration": 25,
        "intensity": "hard", 
        "description": "6x3min @ 5K pace, 90s recovery"
      }
    ]
  }
}`
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Training analytics and performance insights',
    endpoints: [
      {
        method: 'GET',
        path: '/api/analytics/overview',
        title: 'Training Overview',
        description: 'Get training overview and key metrics',
        auth: true,
        parameters: [
          { name: 'period', type: 'string', required: false, description: 'Time period (week|month|year)' }
        ],
        responseExample: `{
  "period": "month",
  "metrics": {
    "totalHours": 32.5,
    "workoutCount": 18,
    "avgReadiness": 7.8,
    "compliance": 89,
    "ctl": 65,
    "atl": 68,
    "tsb": -3
  },
  "trends": {
    "volume": "increasing",
    "readiness": "stable",
    "performance": "improving"
  }
}`
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Subscription and billing management',
    endpoints: [
      {
        method: 'POST',
        path: '/api/billing/checkout',
        title: 'Create Checkout Session',
        description: 'Create Stripe checkout session for subscription',
        auth: true,
        requestBody: `{
  "priceId": "price_pro_monthly",
  "userId": "user_123"
}`,
        responseExample: `{
  "url": "https://checkout.stripe.com/session/cs_123..."
}`
      },
      {
        method: 'POST',
        path: '/api/billing/portal',
        title: 'Create Portal Session',
        description: 'Create Stripe billing portal session',
        auth: true,
        requestBody: `{
  "customerId": "cus_123"
}`,
        responseExample: `{
  "url": "https://billing.stripe.com/session/bps_123..."
}`
      }
    ]
  }
];

function MethodBadge({ method }: { method: string }) {
  const colors = {
    GET: 'bg-green-950/30 text-green-400 border-green-600/30',
    POST: 'bg-blue-950/30 text-blue-400 border-blue-600/30',
    PUT: 'bg-yellow-950/30 text-yellow-400 border-yellow-600/30',
    DELETE: 'bg-red-950/30 text-red-400 border-red-600/30',
  };

  return (
    <Badge variant="outline" className={cn('font-mono text-xs', colors[method as keyof typeof colors])}>
      {method}
    </Badge>
  );
}

interface EndpointItemProps {
  endpoint: ApiEndpoint;
  isExpanded: boolean;
  onToggle: () => void;
}

function EndpointItem({ endpoint, isExpanded, onToggle }: EndpointItemProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-3 flex-1">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm text-red-400 font-mono">{endpoint.path}</code>
          {endpoint.auth && (
            <Lock className="w-3 h-3 text-yellow-400" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="font-medium text-sm">{endpoint.title}</div>
            <div className="text-xs text-muted-foreground">{endpoint.description}</div>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 space-y-4"
        >
          {endpoint.parameters && (
            <div>
              <h4 className="text-sm font-medium mb-2">Parameters</h4>
              <div className="space-y-2">
                {endpoint.parameters.map((param) => (
                  <div key={param.name} className="flex gap-4 text-sm">
                    <code className="text-red-400 font-mono min-w-[100px]">{param.name}</code>
                    <Badge variant="outline">{param.type}</Badge>
                    {param.required && (
                      <Badge variant="outline" className="bg-red-950/30 text-red-400 border-red-600/30">
                        required
                      </Badge>
                    )}
                    <span className="text-muted-foreground">{param.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {endpoint.requestBody && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Request Body</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(endpoint.requestBody!, 'request')}
                  className="h-6 px-2 gap-1"
                >
                  {copiedField === 'request' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span className="text-xs">Copy</span>
                </Button>
              </div>
              <pre className="text-xs bg-gray-900 p-3 rounded-lg overflow-x-auto border border-border/40">
                <code>{endpoint.requestBody}</code>
              </pre>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Response Example</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(endpoint.responseExample, 'response')}
                className="h-6 px-2 gap-1"
              >
                {copiedField === 'response' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span className="text-xs">Copy</span>
              </Button>
            </div>
            <pre className="text-xs bg-gray-900 p-3 rounded-lg overflow-x-auto border border-border/40">
              <code>{endpoint.responseExample}</code>
            </pre>
          </div>
        </motion.div>
      )}
    </Card>
  );
}

export default function ApiDocsPage() {
  const [activeGroup, setActiveGroup] = useState<string>(apiGroups[0].id);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());

  const toggleEndpoint = (path: string) => {
    setExpandedEndpoints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const activeGroupData = apiGroups.find(g => g.id === activeGroup);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="sm" />
              <div>
                <h1 className="text-xl font-bold">API Documentation</h1>
                <p className="text-sm text-muted-foreground">
                  Complete reference for ATHLO API
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-600/30">
                v1.0
              </Badge>
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Postman Collection
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4">API Groups</h3>
              {apiGroups.map((group) => (
                <Button
                  key={group.id}
                  variant={activeGroup === group.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    activeGroup === group.id && "bg-red-600 hover:bg-red-700"
                  )}
                  onClick={() => setActiveGroup(group.id)}
                >
                  {group.title}
                </Button>
              ))}

              {/* Quick Info */}
              <div className="mt-8 p-4 rounded-lg bg-card border border-border/40">
                <h4 className="font-medium text-sm mb-3">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>Base URL: <code className="text-red-400">https://api.athlo.app</code></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <span>Auth: Bearer Token</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span>Format: JSON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeGroupData && (
              <div className="space-y-6">
                {/* Group Header */}
                <div className="pb-6 border-b border-border/40">
                  <h2 className="text-2xl font-bold mb-2">{activeGroupData.title}</h2>
                  <p className="text-muted-foreground">{activeGroupData.description}</p>
                </div>

                {/* Endpoints */}
                <div className="space-y-4">
                  {activeGroupData.endpoints.map((endpoint) => (
                    <motion.div
                      key={endpoint.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EndpointItem
                        endpoint={endpoint}
                        isExpanded={expandedEndpoints.has(endpoint.path)}
                        onToggle={() => toggleEndpoint(endpoint.path)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}