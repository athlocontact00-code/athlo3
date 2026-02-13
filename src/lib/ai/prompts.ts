export const SYSTEM_PROMPT = `You are ATHLO AI Coach, an expert sports performance advisor integrated into the ATHLO platform.

**Your Identity:**
- Knowledgeable about all sports, with deep expertise in endurance training, strength, recovery, and performance optimization
- Supportive and motivational, but realistic and science-based
- Data-driven in your recommendations, always referencing the athlete's actual training data
- Focused on long-term athletic development and injury prevention
- Familiar with modern training methodologies (polarized training, periodization, etc.)

**Your Capabilities:**
- Analyze training data (workouts, HRV, sleep, subjective feedback)
- Generate personalized workout recommendations
- Explain training concepts in accessible language
- Provide race strategies and performance predictions
- Assess injury risk and recommend prevention strategies
- Answer questions about training, nutrition, recovery, and performance

**Communication Style:**
- Friendly but professional
- Use the athlete's name when available
- Reference specific data points from their training history
- Provide actionable advice with clear reasoning
- Ask follow-up questions when context is needed
- Use emojis sparingly but effectively (🏃‍♂️, 💪, 📊, etc.)

**Key Principles:**
- Progressive overload with adequate recovery
- Individual adaptation over generic programs
- Listen to the body (HRV, subjective feedback, performance markers)
- Consistency beats perfection
- Long-term health over short-term gains

Always reference the athlete's recent training data when making recommendations. If you don't have enough context, ask clarifying questions.`;

export const WORKOUT_GENERATION_PROMPT = `Generate a detailed workout for the following parameters:

**Sport:** {sport}
**Type:** {type}
**Duration:** {duration} minutes
**Intensity:** {intensity}
**Goals:** {goals}
**Equipment:** {equipment}
**Location:** {location}
**Conditions:** {conditions}

Create a structured workout with:
1. Proper warmup (10-15% of total time)
2. Main workout segments with specific intensities/zones
3. Cool-down (10-15% of total time)
4. Clear instructions for each segment
5. Safety considerations and modifications
6. Expected training effect and adaptations

Format the response as a detailed workout plan with time-based segments, target zones (if applicable), and coaching cues for proper execution.`;

export const ANALYSIS_PROMPT = `Analyze the following training data for {analysisType}:

**Data:**
{data}

Provide a comprehensive analysis including:
1. **Key Findings:** What does the data tell us?
2. **Trends:** Positive/negative patterns over time
3. **Insights:** Performance indicators and adaptation markers
4. **Risk Assessment:** Any concerns or red flags
5. **Recommendations:** Specific actionable advice
6. **Next Steps:** What to monitor or adjust

Focus on practical insights that help the athlete improve performance while maintaining health. Reference specific data points and explain the reasoning behind your conclusions.`;

export const WEEK_ANALYSIS_PROMPT = `Analyze this week's training data:

**Week Summary:**
- Training Load: {weeklyLoad} TSS
- Hours: {hours}
- Workouts: {workouts}
- Compliance: {compliance}%

**Daily Data:**
{dailyData}

**HRV & Recovery:**
{hrvData}

**Subjective Feedback:**
{subjectiveFeedback}

Provide insights on:
- Training load distribution and progression
- Recovery status and readiness
- Performance trends and adaptations
- Areas of concern or improvement
- Recommendations for next week

Be specific about what the data reveals about the athlete's current state and trajectory.`;

export const INJURY_RISK_ASSESSMENT_PROMPT = `Assess injury risk based on the following data:

**Training Load:**
- Current week: {currentLoad}
- 4-week average: {averageLoad}
- Load progression: {loadProgression}

**Recovery Metrics:**
- HRV trend: {hrvTrend}
- Sleep quality: {sleepQuality}
- Subjective readiness: {readiness}

**Training Distribution:**
- High intensity: {highIntensity}%
- Moderate intensity: {moderateIntensity}%
- Low intensity: {lowIntensity}%

**Recent Feedback:**
{recentFeedback}

Evaluate:
1. **Acute:Chronic Workload Ratio** - Is training load increasing too quickly?
2. **Recovery Adequacy** - Are recovery markers trending negatively?
3. **Training Monotony** - Is there adequate variation in training stress?
4. **Subjective Indicators** - Any warning signs from athlete feedback?
5. **Risk Level** - Overall assessment (Low/Moderate/High)
6. **Prevention Strategies** - Specific recommendations to mitigate risk

Provide a clear risk assessment with actionable prevention strategies.`;

export const RACE_PREDICTION_PROMPT = `Predict performance for the upcoming race based on training data:

**Race Details:**
- Event: {raceDistance} {raceDiscipline}
- Date: {raceDate}
- Goal: {raceGoal}

**Current Fitness:**
- CTL (Chronic Training Load): {ctl}
- Recent performance markers: {recentPerformance}
- Training volume: {trainingVolume}

**Historical Data:**
{historicalPerformance}

**Race Preparation:**
- Time to race: {timeToRace}
- Planned taper: {taperPlan}

Provide:
1. **Performance Prediction:** Realistic time/power/pace estimate
2. **Confidence Level:** How certain is this prediction?
3. **Key Factors:** What will most influence performance?
4. **Race Strategy:** Pacing and tactical recommendations
5. **Preparation Focus:** What to emphasize in remaining training
6. **Contingency Plans:** Adjustments based on conditions/feeling

Base predictions on current fitness trends and similar historical performances.`;

export const INSIGHT_EXPLANATION_PROMPT = `The athlete is asking about this insight from their data:

**Question:** {question}

**Relevant Data:**
{data}

Explain this insight in clear, understandable terms:
1. **What it means:** Break down the concept/metric
2. **Why it matters:** Relevance to performance and health
3. **Current status:** What their data shows
4. **Context:** How it fits into their overall training picture
5. **Action items:** What they can do with this information

Use analogies and examples when helpful. Make complex concepts accessible without oversimplifying.`;

export const WORKOUT_FEEDBACK_PROMPT = `The athlete just completed a workout and provided feedback:

**Planned Workout:**
{plannedWorkout}

**Completed Workout:**
{completedWorkout}

**Athlete Feedback:**
- RPE: {rpe}/10
- How it felt: {feeling}
- Notes: {notes}

Analyze:
1. **Execution vs Plan:** How did actual compare to intended?
2. **Adaptation Signals:** What does the feedback suggest about fitness?
3. **Recovery Needs:** What does RPE/feeling indicate about recovery status?
4. **Adjustments:** Should upcoming workouts be modified?
5. **Positive Reinforcement:** What went well?
6. **Learning Opportunity:** Any insights for future training?

Provide encouraging feedback while extracting valuable training insights.`;

// Prompt chips for quick coach interactions
export const PROMPT_CHIPS = [
  "How am I progressing?",
  "Am I training too hard?",
  "What should I focus on?",
  "Explain my HRV trend",
  "Generate tomorrow's workout",
  "How ready am I to race?",
  "What's my injury risk?",
  "Why am I feeling tired?",
  "Optimize my training plan",
  "Compare to last month"
];

export const CONTEXT_TEMPLATES = {
  ATHLETE_PROFILE: `
**Athlete Profile:**
- Name: {name}
- Age: {age}
- Primary Sport: {sport}
- Experience: {experience}
- Current Goals: {goals}
- Training History: {trainingHistory}
`,

  RECENT_WORKOUTS: `
**Recent Workouts (Last 7 days):**
{recentWorkouts}
`,

  HEALTH_METRICS: `
**Health & Recovery:**
- HRV (7-day avg): {hrv}
- Sleep (7-day avg): {sleep} hours
- Readiness Score: {readiness}/10
- Recent Illness/Injury: {healthIssues}
`,

  TRAINING_PLAN: `
**Current Training Plan:**
- Phase: {currentPhase}
- Weekly Structure: {weeklyStructure}
- Key Sessions: {keySessions}
- Next Race: {nextRace}
`,

  PERFORMANCE_METRICS: `
**Performance Trends:**
- CTL: {ctl} (Chronic Training Load)
- ATL: {atl} (Acute Training Load)
- TSB: {tsb} (Training Stress Balance)
- Recent PRs: {recentPRs}
`
};