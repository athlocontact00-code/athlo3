type EventType = 'message_received' | 'typing_start' | 'typing_stop' | 'status_change' | 'workout_update' | 'notification';

interface RealtimeEvent {
  type: EventType;
  data: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

interface EventListener {
  id: string;
  event: EventType;
  callback: (data: any) => void;
}

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export class RealtimeManager {
  private ws: WebSocket | null = null;
  private listeners: EventListener[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private connectionState: ConnectionState = 'disconnected';
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private userId?: string;
  private sessionId: string;
  
  // Mock mode - uses setTimeout instead of real WebSocket
  private mockMode = true;
  private mockEvents: RealtimeEvent[] = [];
  
  constructor(userId?: string) {
    this.userId = userId;
    this.sessionId = this.generateSessionId();
    
    // Start mock event simulation
    if (this.mockMode) {
      this.startMockEventSimulation();
    }
  }
  
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  connect(url?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.mockMode) {
        // Mock connection
        this.connectionState = 'connecting';
        this.emit('connection_state_change', { state: 'connecting' });
        
        setTimeout(() => {
          this.connectionState = 'connected';
          this.emit('connection_state_change', { state: 'connected' });
          this.startHeartbeat();
          resolve();
        }, 1000);
        return;
      }
      
      try {
        this.connectionState = 'connecting';
        this.emit('connection_state_change', { state: 'connecting' });
        
        const wsUrl = url || this.getWebSocketUrl();
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          this.connectionState = 'connected';
          this.reconnectAttempts = 0;
          this.emit('connection_state_change', { state: 'connected' });
          this.startHeartbeat();
          
          // Send authentication if userId is available
          if (this.userId) {
            this.send('auth', { userId: this.userId, sessionId: this.sessionId });
          }
          
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };
        
        this.ws.onclose = () => {
          this.connectionState = 'disconnected';
          this.emit('connection_state_change', { state: 'disconnected' });
          this.stopHeartbeat();
          this.attemptReconnect();
        };
        
        this.ws.onerror = (error) => {
          this.connectionState = 'error';
          this.emit('connection_state_change', { state: 'error', error });
          reject(error);
        };
        
      } catch (error) {
        this.connectionState = 'error';
        this.emit('connection_state_change', { state: 'error', error });
        reject(error);
      }
    });
  }
  
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.stopHeartbeat();
    this.connectionState = 'disconnected';
    this.emit('connection_state_change', { state: 'disconnected' });
  }
  
  subscribe(event: EventType, callback: (data: any) => void): string {
    const id = 'listener_' + Math.random().toString(36).substr(2, 9);
    this.listeners.push({ id, event, callback });
    return id;
  }
  
  unsubscribe(listenerId: string): void {
    this.listeners = this.listeners.filter(listener => listener.id !== listenerId);
  }
  
  send(type: string, data: any): void {
    const message = {
      type,
      data,
      timestamp: new Date(),
      sessionId: this.sessionId,
    };
    
    if (this.mockMode) {
      // Mock sending - just log for now
      console.log('Mock send:', message);
      return;
    }
    
    if (this.ws && this.connectionState === 'connected') {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }
  
  // Convenience methods for specific events
  sendMessage(threadId: string, content: string): void {
    this.send('message_send', {
      threadId,
      content,
      userId: this.userId,
    });
  }
  
  startTyping(threadId: string): void {
    this.send('typing_start', {
      threadId,
      userId: this.userId,
    });
  }
  
  stopTyping(threadId: string): void {
    this.send('typing_stop', {
      threadId,
      userId: this.userId,
    });
  }
  
  updateStatus(status: string): void {
    this.send('status_update', {
      status,
      userId: this.userId,
    });
  }
  
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }
  
  isConnected(): boolean {
    return this.connectionState === 'connected';
  }
  
  private emit(event: string, data: any): void {
    const listeners = this.listeners.filter(listener => listener.event === event);
    listeners.forEach(listener => {
      try {
        listener.callback(data);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }
  
  private handleMessage(message: any): void {
    const event: RealtimeEvent = {
      type: message.type,
      data: message.data,
      timestamp: new Date(message.timestamp),
      userId: message.userId,
      sessionId: message.sessionId,
    };
    
    this.emit(event.type, event.data);
  }
  
  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }
  
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.mockMode) {
        // Mock heartbeat - just update connection state
        return;
      }
      
      if (this.ws && this.connectionState === 'connected') {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 30000); // 30 seconds
  }
  
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      if (this.connectionState !== 'connected') {
        this.connect();
      }
    }, delay);
  }
  
  // Mock event simulation for demo purposes
  private startMockEventSimulation(): void {
    if (!this.mockMode) return;
    
    const mockEvents = [
      {
        type: 'message_received' as EventType,
        data: {
          threadId: 'thread_coach_123',
          content: 'Great job on today\'s workout!',
          senderId: 'coach_sarah',
          senderName: 'Sarah Johnson',
        },
        delay: 5000,
      },
      {
        type: 'notification' as EventType,
        data: {
          title: 'New AI insight available',
          description: 'Your recovery metrics show interesting patterns',
          type: 'ai',
        },
        delay: 10000,
      },
      {
        type: 'workout_update' as EventType,
        data: {
          workoutId: 'workout_123',
          status: 'completed',
          athleteId: 'athlete_456',
        },
        delay: 15000,
      },
      {
        type: 'typing_start' as EventType,
        data: {
          threadId: 'thread_coach_123',
          userId: 'coach_sarah',
          userName: 'Sarah Johnson',
        },
        delay: 20000,
      },
      {
        type: 'typing_stop' as EventType,
        data: {
          threadId: 'thread_coach_123',
          userId: 'coach_sarah',
        },
        delay: 23000,
      },
    ];
    
    mockEvents.forEach((event) => {
      setTimeout(() => {
        if (this.connectionState === 'connected') {
          this.emit(event.type, event.data);
        }
      }, event.delay);
    });
    
    // Repeat mock events every 30 seconds
    setInterval(() => {
      if (this.connectionState === 'connected' && Math.random() > 0.7) {
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        this.emit(randomEvent.type, {
          ...randomEvent.data,
          timestamp: new Date(),
        });
      }
    }, 30000);
  }
  
  // Static instance management
  private static instance: RealtimeManager | null = null;
  
  static getInstance(userId?: string): RealtimeManager {
    if (!RealtimeManager.instance) {
      RealtimeManager.instance = new RealtimeManager(userId);
    }
    return RealtimeManager.instance;
  }
  
  static cleanup(): void {
    if (RealtimeManager.instance) {
      RealtimeManager.instance.disconnect();
      RealtimeManager.instance = null;
    }
  }
}

// Export convenience functions
export function getRealtimeManager(userId?: string): RealtimeManager {
  return RealtimeManager.getInstance(userId);
}

export function cleanupRealtime(): void {
  RealtimeManager.cleanup();
}