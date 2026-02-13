'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RealtimeManager, ConnectionState, getRealtimeManager } from '@/lib/realtime';

type EventType = 'message_received' | 'typing_start' | 'typing_stop' | 'status_change' | 'workout_update' | 'notification';

interface RealtimeHookOptions {
  userId?: string;
  autoConnect?: boolean;
  events?: EventType[];
}

interface RealtimeState {
  isConnected: boolean;
  connectionState: ConnectionState;
  lastEvent: { type: string; data: any; timestamp: Date } | null;
  error: Error | null;
}

export function useRealtime(options: RealtimeHookOptions = {}) {
  const { userId, autoConnect = true, events = [] } = options;
  
  const [state, setState] = useState<RealtimeState>({
    isConnected: false,
    connectionState: 'disconnected',
    lastEvent: null,
    error: null,
  });
  
  const realtimeManager = useRef<RealtimeManager | null>(null);
  const listenerIds = useRef<string[]>([]);
  
  const connect = useCallback(async () => {
    if (!realtimeManager.current) {
      realtimeManager.current = getRealtimeManager(userId);
    }
    
    try {
      await realtimeManager.current.connect();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        connectionState: 'error',
        isConnected: false,
      }));
    }
  }, [userId]);
  
  const disconnect = useCallback(() => {
    if (realtimeManager.current) {
      realtimeManager.current.disconnect();
    }
  }, []);
  
  const subscribe = useCallback((event: EventType, callback: (data: any) => void) => {
    if (!realtimeManager.current) return '';
    
    const listenerId = realtimeManager.current.subscribe(event, callback);
    listenerIds.current.push(listenerId);
    return listenerId;
  }, []);
  
  const unsubscribe = useCallback((listenerId: string) => {
    if (!realtimeManager.current) return;
    
    realtimeManager.current.unsubscribe(listenerId);
    listenerIds.current = listenerIds.current.filter(id => id !== listenerId);
  }, []);
  
  const send = useCallback((type: string, data: any) => {
    if (realtimeManager.current) {
      realtimeManager.current.send(type, data);
    }
  }, []);
  
  const sendMessage = useCallback((threadId: string, content: string) => {
    if (realtimeManager.current) {
      realtimeManager.current.sendMessage(threadId, content);
    }
  }, []);
  
  const startTyping = useCallback((threadId: string) => {
    if (realtimeManager.current) {
      realtimeManager.current.startTyping(threadId);
    }
  }, []);
  
  const stopTyping = useCallback((threadId: string) => {
    if (realtimeManager.current) {
      realtimeManager.current.stopTyping(threadId);
    }
  }, []);
  
  const updateStatus = useCallback((status: string) => {
    if (realtimeManager.current) {
      realtimeManager.current.updateStatus(status);
    }
  }, []);
  
  useEffect(() => {
    // Initialize realtime manager
    realtimeManager.current = getRealtimeManager(userId);
    
    // Subscribe to connection state changes
    const connectionStateListener = realtimeManager.current.subscribe(
      'connection_state_change' as EventType,
      (data: { state: ConnectionState; error?: any }) => {
        setState(prev => ({
          ...prev,
          connectionState: data.state,
          isConnected: data.state === 'connected',
          error: data.error || null,
        }));
      }
    );
    
    // Subscribe to specified events
    const eventListeners: string[] = [];
    events.forEach(event => {
      const listenerId = realtimeManager.current!.subscribe(event, (data: any) => {
        setState(prev => ({
          ...prev,
          lastEvent: {
            type: event,
            data,
            timestamp: new Date(),
          },
        }));
      });
      eventListeners.push(listenerId);
    });
    
    listenerIds.current = [connectionStateListener, ...eventListeners];
    
    // Auto-connect if enabled
    if (autoConnect) {
      connect();
    }
    
    return () => {
      // Cleanup listeners
      listenerIds.current.forEach(id => {
        if (realtimeManager.current) {
          realtimeManager.current.unsubscribe(id);
        }
      });
      listenerIds.current = [];
    };
  }, [userId, autoConnect, events, connect]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (listenerIds.current.length > 0) {
        listenerIds.current.forEach(id => {
          if (realtimeManager.current) {
            realtimeManager.current.unsubscribe(id);
          }
        });
      }
    };
  }, []);
  
  return {
    ...state,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
    sendMessage,
    startTyping,
    stopTyping,
    updateStatus,
  };
}

// Specialized hooks for specific use cases
export function useRealtimeMessages(threadId?: string, userId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const { isConnected, subscribe, unsubscribe, sendMessage, startTyping, stopTyping } = useRealtime({
    userId,
    events: ['message_received', 'typing_start', 'typing_stop'],
  });
  
  useEffect(() => {
    const messageListener = subscribe('message_received', (data) => {
      if (!threadId || data.threadId === threadId) {
        setMessages(prev => [...prev, data]);
      }
    });
    
    const typingStartListener = subscribe('typing_start', (data) => {
      if (!threadId || data.threadId === threadId) {
        setTypingUsers(prev => {
          if (!prev.includes(data.userId)) {
            return [...prev, data.userId];
          }
          return prev;
        });
      }
    });
    
    const typingStopListener = subscribe('typing_stop', (data) => {
      if (!threadId || data.threadId === threadId) {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    });
    
    return () => {
      unsubscribe(messageListener);
      unsubscribe(typingStartListener);
      unsubscribe(typingStopListener);
    };
  }, [threadId, subscribe, unsubscribe]);
  
  const sendMessageToThread = useCallback((content: string) => {
    if (threadId) {
      sendMessage(threadId, content);
    }
  }, [threadId, sendMessage]);
  
  const startTypingInThread = useCallback(() => {
    if (threadId) {
      startTyping(threadId);
    }
  }, [threadId, startTyping]);
  
  const stopTypingInThread = useCallback(() => {
    if (threadId) {
      stopTyping(threadId);
    }
  }, [threadId, stopTyping]);
  
  return {
    messages,
    typingUsers,
    isConnected,
    sendMessage: sendMessageToThread,
    startTyping: startTypingInThread,
    stopTyping: stopTypingInThread,
  };
}

export function useRealtimeNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const { isConnected, subscribe, unsubscribe } = useRealtime({
    userId,
    events: ['notification'],
  });
  
  useEffect(() => {
    const notificationListener = subscribe('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
    });
    
    return () => {
      unsubscribe(notificationListener);
    };
  }, [subscribe, unsubscribe]);
  
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  return {
    notifications,
    isConnected,
    clearNotification,
    clearAllNotifications,
  };
}

export function useRealtimeWorkouts(userId?: string) {
  const [workoutUpdates, setWorkoutUpdates] = useState<any[]>([]);
  
  const { isConnected, subscribe, unsubscribe } = useRealtime({
    userId,
    events: ['workout_update'],
  });
  
  useEffect(() => {
    const workoutListener = subscribe('workout_update', (data) => {
      setWorkoutUpdates(prev => [data, ...prev.slice(0, 49)]); // Keep last 50 updates
    });
    
    return () => {
      unsubscribe(workoutListener);
    };
  }, [subscribe, unsubscribe]);
  
  return {
    workoutUpdates,
    isConnected,
  };
}