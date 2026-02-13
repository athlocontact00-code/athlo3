import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  decimal,
  boolean,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['athlete', 'coach', 'admin']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other', 'prefer_not_to_say']);
export const sportTypeEnum = pgEnum('sport_type', [
  'running',
  'cycling',
  'swimming',
  'triathlon',
  'football',
  'hyrox',
  'strength',
  'crossfit',
  'rowing',
  'other'
]);
export const workoutStatusEnum = pgEnum('workout_status', ['draft', 'scheduled', 'completed', 'skipped']);
export const intensityZoneEnum = pgEnum('intensity_zone', ['z1', 'z2', 'z3', 'z4', 'z5']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'workout', 'media', 'system']);
export const integrationTypeEnum = pgEnum('integration_type', [
  'strava',
  'garmin',
  'apple_health',
  'google_fit',
  'polar',
  'suunto',
  'wahoo'
]);

// Core Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  role: userRoleEnum('role').notNull().default('athlete'),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex('users_email_idx').on(table.email),
}));

// Athlete Profiles
export const athleteProfiles = pgTable('athlete_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  gender: genderEnum('gender'),
  height: integer('height'), // in cm
  weight: decimal('weight', { precision: 5, scale: 2 }), // in kg
  restingHeartRate: integer('resting_heart_rate'),
  maxHeartRate: integer('max_heart_rate'),
  functionalThresholdPower: integer('functional_threshold_power'), // watts
  vo2Max: decimal('vo2_max', { precision: 4, scale: 1 }),
  primarySport: sportTypeEnum('primary_sport'),
  secondarySports: sportTypeEnum('secondary_sports').array(),
  trainingExperience: integer('training_experience'), // years
  weeklyTrainingHours: decimal('weekly_training_hours', { precision: 4, scale: 1 }),
  goals: text('goals'),
  injuries: text('injuries'),
  preferences: jsonb('preferences'), // training preferences, notifications, etc.
  timezone: text('timezone').default('UTC'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: uniqueIndex('athlete_profiles_user_idx').on(table.userId),
}));

// Coach Profiles
export const coachProfiles = pgTable('coach_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  certifications: text('certifications').array(),
  specialties: sportTypeEnum('specialties').array(),
  experienceYears: integer('experience_years'),
  hourlyRate: decimal('hourly_rate', { precision: 6, scale: 2 }),
  currency: text('currency').default('USD'),
  availability: jsonb('availability'), // schedule availability
  isVerified: boolean('is_verified').default(false),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: uniqueIndex('coach_profiles_user_idx').on(table.userId),
}));

// Teams/Groups
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  avatar: text('avatar'),
  coachId: uuid('coach_id').notNull().references(() => users.id),
  isPrivate: boolean('is_private').default(false),
  maxMembers: integer('max_members').default(50),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  coachIdx: index('teams_coach_idx').on(table.coachId),
}));

// Team Members
export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  isActive: boolean('is_active').default(true),
}, (table) => ({
  teamUserIdx: uniqueIndex('team_members_team_user_idx').on(table.teamId, table.userId),
}));

// Workout Templates
export const workoutTemplates = pgTable('workout_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  sport: sportTypeEnum('sport').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  isPublic: boolean('is_public').default(false),
  structure: jsonb('structure').notNull(), // workout intervals, sets, reps, etc.
  estimatedDuration: integer('estimated_duration'), // minutes
  difficultyLevel: integer('difficulty_level'), // 1-10
  targetZones: intensityZoneEnum('target_zones').array(),
  tags: text('tags').array(),
  usageCount: integer('usage_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  createdByIdx: index('workout_templates_created_by_idx').on(table.createdBy),
  sportIdx: index('workout_templates_sport_idx').on(table.sport),
}));

// Planned Workouts
export const plannedWorkouts = pgTable('planned_workouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  athleteId: uuid('athlete_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  coachId: uuid('coach_id').references(() => users.id),
  templateId: uuid('template_id').references(() => workoutTemplates.id),
  name: text('name').notNull(),
  description: text('description'),
  sport: sportTypeEnum('sport').notNull(),
  scheduledDate: timestamp('scheduled_date', { withTimezone: true }).notNull(),
  structure: jsonb('structure').notNull(),
  notes: text('notes'),
  status: workoutStatusEnum('status').default('scheduled'),
  estimatedDuration: integer('estimated_duration'),
  targetLoad: decimal('target_load', { precision: 6, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  athleteIdx: index('planned_workouts_athlete_idx').on(table.athleteId),
  dateIdx: index('planned_workouts_date_idx').on(table.scheduledDate),
  athleteDateIdx: index('planned_workouts_athlete_date_idx').on(table.athleteId, table.scheduledDate),
}));

// Completed Workouts
export const completedWorkouts = pgTable('completed_workouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  plannedWorkoutId: uuid('planned_workout_id').references(() => plannedWorkouts.id),
  athleteId: uuid('athlete_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sport: sportTypeEnum('sport').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).notNull(),
  duration: integer('duration'), // actual duration in minutes
  distance: decimal('distance', { precision: 8, scale: 2 }), // in meters
  calories: integer('calories'),
  avgHeartRate: integer('avg_heart_rate'),
  maxHeartRate: integer('max_heart_rate'),
  avgPower: integer('avg_power'), // watts
  maxPower: integer('max_power'),
  avgPace: decimal('avg_pace', { precision: 6, scale: 2 }), // seconds per km
  elevationGain: decimal('elevation_gain', { precision: 8, scale: 2 }), // meters
  trainingLoad: decimal('training_load', { precision: 6, scale: 2 }),
  rpe: integer('rpe'), // Rate of Perceived Exertion 1-10
  structure: jsonb('structure'), // actual workout data
  metrics: jsonb('metrics'), // detailed metrics, zones, laps
  notes: text('notes'),
  feeling: integer('feeling'), // 1-5 scale
  integrationId: text('integration_id'), // external platform ID
  integrationSource: integrationTypeEnum('integration_source'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  athleteIdx: index('completed_workouts_athlete_idx').on(table.athleteId),
  dateIdx: index('completed_workouts_date_idx').on(table.completedAt),
  athleteDateIdx: index('completed_workouts_athlete_date_idx').on(table.athleteId, table.completedAt),
}));

// Daily Check-ins
export const dailyCheckIns = pgTable('daily_check_ins', {
  id: uuid('id').primaryKey().defaultRandom(),
  athleteId: uuid('athlete_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date', { mode: 'date' }).notNull(),
  sleepQuality: integer('sleep_quality'), // 1-5 scale
  sleepHours: decimal('sleep_hours', { precision: 3, scale: 1 }),
  restingHeartRate: integer('resting_heart_rate'),
  hrv: integer('hrv'), // Heart Rate Variability
  stressLevel: integer('stress_level'), // 1-5 scale
  energyLevel: integer('energy_level'), // 1-5 scale
  motivation: integer('motivation'), // 1-5 scale
  soreness: integer('soreness'), // 1-5 scale
  readinessScore: decimal('readiness_score', { precision: 4, scale: 1 }), // calculated score
  weight: decimal('weight', { precision: 5, scale: 2 }),
  notes: text('notes'),
  mood: integer('mood'), // 1-5 scale
  hydration: integer('hydration'), // 1-5 scale
  nutrition: integer('nutrition'), // 1-5 scale
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  athleteDateIdx: uniqueIndex('daily_check_ins_athlete_date_idx').on(table.athleteId, table.date),
  dateIdx: index('daily_check_ins_date_idx').on(table.date),
}));

// Calendar Events
export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  isAllDay: boolean('is_all_day').default(false),
  location: text('location'),
  color: text('color'),
  workoutId: uuid('workout_id').references(() => plannedWorkouts.id),
  checkInId: uuid('check_in_id').references(() => dailyCheckIns.id),
  eventType: text('event_type').notNull(), // workout, check-in, race, recovery, etc.
  isRecurring: boolean('is_recurring').default(false),
  recurrencePattern: jsonb('recurrence_pattern'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('calendar_events_user_idx').on(table.userId),
  dateIdx: index('calendar_events_date_idx').on(table.startTime),
}));

// Message Threads
export const messageThreads = pgTable('message_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  isGroup: boolean('is_group').default(false),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  teamId: uuid('team_id').references(() => teams.id),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Message Thread Participants
export const messageThreadParticipants = pgTable('message_thread_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').notNull().references(() => messageThreads.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  lastReadAt: timestamp('last_read_at', { withTimezone: true }),
  isMuted: boolean('is_muted').default(false),
}, (table) => ({
  threadUserIdx: uniqueIndex('message_thread_participants_thread_user_idx').on(table.threadId, table.userId),
}));

// Messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id').notNull().references(() => messageThreads.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  content: text('content'),
  type: messageTypeEnum('type').default('text'),
  workoutId: uuid('workout_id').references(() => plannedWorkouts.id),
  mediaUrls: text('media_urls').array(),
  replyToId: uuid('reply_to_id'),
  isEdited: boolean('is_edited').default(false),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  threadIdx: index('messages_thread_idx').on(table.threadId),
  senderIdx: index('messages_sender_idx').on(table.senderId),
  dateIdx: index('messages_date_idx').on(table.createdAt),
  replyToRef: index('messages_reply_to_idx').on(table.replyToId),
}));

// Insights (Analytics Cards)
export const insights = pgTable('insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // load_trend, performance_improvement, recovery_alert, etc.
  title: text('title').notNull(),
  description: text('description').notNull(),
  explanation: text('explanation'), // AI explainability
  data: jsonb('data'), // supporting data for the insight
  priority: integer('priority').default(3), // 1-5, 5 being highest
  isRead: boolean('is_read').default(false),
  validUntil: timestamp('valid_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('insights_user_idx').on(table.userId),
  priorityIdx: index('insights_priority_idx').on(table.priority),
  dateIdx: index('insights_date_idx').on(table.createdAt),
}));

// AI Conversations
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  isArchived: boolean('is_archived').default(false),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('ai_conversations_user_idx').on(table.userId),
}));

// AI Messages
export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => aiConversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  metadata: jsonb('metadata'), // model, tokens, context, etc.
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  conversationIdx: index('ai_messages_conversation_idx').on(table.conversationId),
  dateIdx: index('ai_messages_date_idx').on(table.createdAt),
}));

// Integration Tokens
export const integrationTokens = pgTable('integration_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: integrationTypeEnum('platform').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  scope: text('scope'),
  isActive: boolean('is_active').default(true),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  syncFrequency: integer('sync_frequency').default(3600), // seconds
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userPlatformIdx: uniqueIndex('integration_tokens_user_platform_idx').on(table.userId, table.platform),
}));

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  athleteProfile: one(athleteProfiles),
  coachProfile: one(coachProfiles),
  teams: many(teams),
  teamMemberships: many(teamMembers),
  workoutTemplates: many(workoutTemplates),
  plannedWorkouts: many(plannedWorkouts),
  completedWorkouts: many(completedWorkouts),
  dailyCheckIns: many(dailyCheckIns),
  calendarEvents: many(calendarEvents),
  messageThreads: many(messageThreads),
  messages: many(messages),
  insights: many(insights),
  aiConversations: many(aiConversations),
  integrationTokens: many(integrationTokens),
}));

export const athleteProfilesRelations = relations(athleteProfiles, ({ one }) => ({
  user: one(users, { fields: [athleteProfiles.userId], references: [users.id] }),
}));

export const coachProfilesRelations = relations(coachProfiles, ({ one }) => ({
  user: one(users, { fields: [coachProfiles.userId], references: [users.id] }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  coach: one(users, { fields: [teams.coachId], references: [users.id] }),
  members: many(teamMembers),
  messageThreads: many(messageThreads),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
}));

export const workoutTemplatesRelations = relations(workoutTemplates, ({ one, many }) => ({
  creator: one(users, { fields: [workoutTemplates.createdBy], references: [users.id] }),
  plannedWorkouts: many(plannedWorkouts),
}));

export const plannedWorkoutsRelations = relations(plannedWorkouts, ({ one, many }) => ({
  athlete: one(users, { fields: [plannedWorkouts.athleteId], references: [users.id] }),
  coach: one(users, { fields: [plannedWorkouts.coachId], references: [users.id] }),
  template: one(workoutTemplates, { fields: [plannedWorkouts.templateId], references: [workoutTemplates.id] }),
  completedWorkout: one(completedWorkouts),
  calendarEvents: many(calendarEvents),
}));

export const completedWorkoutsRelations = relations(completedWorkouts, ({ one }) => ({
  athlete: one(users, { fields: [completedWorkouts.athleteId], references: [users.id] }),
  plannedWorkout: one(plannedWorkouts, { fields: [completedWorkouts.plannedWorkoutId], references: [plannedWorkouts.id] }),
}));

export const dailyCheckInsRelations = relations(dailyCheckIns, ({ one, many }) => ({
  athlete: one(users, { fields: [dailyCheckIns.athleteId], references: [users.id] }),
  calendarEvents: many(calendarEvents),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  user: one(users, { fields: [calendarEvents.userId], references: [users.id] }),
  workout: one(plannedWorkouts, { fields: [calendarEvents.workoutId], references: [plannedWorkouts.id] }),
  checkIn: one(dailyCheckIns, { fields: [calendarEvents.checkInId], references: [dailyCheckIns.id] }),
}));

export const messageThreadsRelations = relations(messageThreads, ({ one, many }) => ({
  creator: one(users, { fields: [messageThreads.createdBy], references: [users.id] }),
  team: one(teams, { fields: [messageThreads.teamId], references: [teams.id] }),
  participants: many(messageThreadParticipants),
  messages: many(messages),
}));

export const messageThreadParticipantsRelations = relations(messageThreadParticipants, ({ one }) => ({
  thread: one(messageThreads, { fields: [messageThreadParticipants.threadId], references: [messageThreads.id] }),
  user: one(users, { fields: [messageThreadParticipants.userId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  thread: one(messageThreads, { fields: [messages.threadId], references: [messageThreads.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
  workout: one(plannedWorkouts, { fields: [messages.workoutId], references: [plannedWorkouts.id] }),
  replyTo: one(messages, { fields: [messages.replyToId], references: [messages.id], relationName: 'MessageReplies' }),
  replies: many(messages, { relationName: 'MessageReplies' }),
}));

export const insightsRelations = relations(insights, ({ one }) => ({
  user: one(users, { fields: [insights.userId], references: [users.id] }),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one, many }) => ({
  user: one(users, { fields: [aiConversations.userId], references: [users.id] }),
  messages: many(aiMessages),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  conversation: one(aiConversations, { fields: [aiMessages.conversationId], references: [aiConversations.id] }),
}));

export const integrationTokensRelations = relations(integrationTokens, ({ one }) => ({
  user: one(users, { fields: [integrationTokens.userId], references: [users.id] }),
}));

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AthleteProfile = typeof athleteProfiles.$inferSelect;
export type NewAthleteProfile = typeof athleteProfiles.$inferInsert;
export type CoachProfile = typeof coachProfiles.$inferSelect;
export type NewCoachProfile = typeof coachProfiles.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;
export type NewWorkoutTemplate = typeof workoutTemplates.$inferInsert;
export type PlannedWorkout = typeof plannedWorkouts.$inferSelect;
export type NewPlannedWorkout = typeof plannedWorkouts.$inferInsert;
export type CompletedWorkout = typeof completedWorkouts.$inferSelect;
export type NewCompletedWorkout = typeof completedWorkouts.$inferInsert;
export type DailyCheckIn = typeof dailyCheckIns.$inferSelect;
export type NewDailyCheckIn = typeof dailyCheckIns.$inferInsert;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;
export type MessageThread = typeof messageThreads.$inferSelect;
export type NewMessageThread = typeof messageThreads.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Insight = typeof insights.$inferSelect;
export type NewInsight = typeof insights.$inferInsert;
export type AIConversation = typeof aiConversations.$inferSelect;
export type NewAIConversation = typeof aiConversations.$inferInsert;
export type AIMessage = typeof aiMessages.$inferSelect;
export type NewAIMessage = typeof aiMessages.$inferInsert;
export type IntegrationToken = typeof integrationTokens.$inferSelect;
export type NewIntegrationToken = typeof integrationTokens.$inferInsert;