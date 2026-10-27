# PHASE 4 - SIX AI AGENTS ARCHITECTURE

**Status:** ✅ COMPLETE
**Date:** 2026-10-26

## Overview

The Mantra application now features a complete 6-agent AI architecture, where each agent has specialized responsibilities and system prompts. All agents run on Cloudflare Workers AI and communicate via JSON APIs.

## The Six Agents

### 1. Companion Agent 🤝
**Endpoint:** `/companion`
**Purpose:** Emotional support and conversation

**Capabilities:**
- Warm, empathetic responses
- Context-aware from conversation history
- Crisis detection and resource guidance (988 Lifeline)
- Character-aware tone (uses selected companion name)
- Honest about AI limitations

**System Prompt Focus:**
- Keep responses concise (2-3 sentences)
- Suggest practical small steps
- Never claim to perform actions not done
- Acknowledge feelings without dismissing

**API Request:**
```json
{
  "message": "I'm feeling overwhelmed with finals",
  "companionName": "Spider-Man",
  "displayName": "Alex",
  "history": [...]
}
```

**API Response:**
```json
{
  "reply": "Hey Alex, I hear you - finals week can feel like a lot..."
}
```

---

### 2. Career Navigator Agent 🎯
**Endpoint:** `/career`
**Purpose:** Career exploration and roadmap generation

**Capabilities:**
- Structured career path recommendations
- Skill identification and learning resources
- Step-by-step actionable plans
- Time estimates and prerequisites
- Honest about uncertainty

**System Prompt Focus:**
- Return valid JSON only
- Be practical about difficulty and time
- Tell users to verify requirements
- Don't guarantee outcomes
- Adapt to available time/resources

**API Request:**
```json
{
  "prompt": "I want to become a UI/UX designer",
  "displayName": "Alex"
}
```

**API Response:**
```json
{
  "roadmap": {
    "title": "Path to UI/UX Design",
    "summary": "Learn design principles, tools, and build portfolio",
    "skills": ["Figma", "User Research", "Wireframing", "Prototyping"],
    "steps": [
      {
        "title": "Learn Design Fundamentals",
        "description": "Complete free courses on design principles and color theory",
        "timeframe": "2-3 months"
      },
      ...
    ]
  }
}
```

---

### 3. Quest/Learning Agent 🎮
**Endpoint:** `/quest`
**Purpose:** Educational mini-activities and challenges

**Capabilities:**
- Generate quizzes, challenges, and reflections
- Difficulty-adjusted content
- Wellbeing-focused activities
- Thoughtful explanations
- Encouragement over perfection

**System Prompt Focus:**
- Return valid JSON structure
- Make activities gentle and bite-sized
- Celebrate effort
- Keep appropriate for stressed students

**API Request:**
```json
{
  "topic": "stress management",
  "difficulty": "easy"
}
```

**API Response:**
```json
{
  "activity": {
    "type": "quiz",
    "title": "Quick Stress Check-In",
    "content": "What helps you feel calmer?",
    "options": ["Deep breathing", "Walking", "Music", "Talking to someone"],
    "explanation": "Different strategies work for different people - experiment!",
    "difficulty": "easy"
  }
}
```

---

### 4. Reflection Agent 📝
**Endpoint:** `/reflection`
**Purpose:** Journaling prompts and self-reflection

**Capabilities:**
- Generate thoughtful reflection prompts
- Context-aware questions
- Non-judgmental tone
- Specific yet open-ended
- Examples for inspiration

**System Prompt Focus:**
- Avoid "why" (can feel judgmental)
- Use "what" or "how" instead
- No wrong answers
- Suitable for stressed students

**API Request:**
```json
{
  "context": "feeling uncertain about future"
}
```

**API Response:**
```json
{
  "prompt": {
    "prompt": "What would taking one tiny step forward look like for you today?",
    "context": "Small actions can reduce uncertainty without requiring perfect clarity",
    "examples": [
      "Researching one potential career for 10 minutes",
      "Reaching out to someone who might have advice"
    ]
  }
}
```

---

### 5. Community Safety Agent 🛡️
**Endpoint:** `/safety`
**Purpose:** Content moderation and safety review

**Capabilities:**
- Severity assessment (low/medium/high/critical)
- Category classification
- Recommended action
- Human review flagging
- Context-aware judgments

**System Prompt Focus:**
- Critical content requires human review
- Protect vulnerable users
- False positives acceptable for safety
- Consider context and intent

**API Request:**
```json
{
  "content": "Post content to review",
  "reason": "harassment"
}
```

**API Response:**
```json
{
  "review": {
    "severity": "high",
    "category": "harassment",
    "action": "hide",
    "reasoning": "Contains targeted personal attacks",
    "requires_human": true
  }
}
```

---

### 6. World Builder Agent 🌍
**Endpoint:** `/world`
**Purpose:** Experience customization suggestions

**Capabilities:**
- Personalized customization ideas
- Universe-aware suggestions
- Visual preview descriptions
- Respect user preferences
- Encourage experimentation

**System Prompt Focus:**
- Match selected universe (Avengers, Sanrio, etc.)
- Keep suggestions feasible
- Explain impact on experience
- Foster play and exploration

**API Request:**
```json
{
  "preferences": {
    "universe": "Sanrio",
    "companion": "Hello Kitty",
    "mood": "cozy"
  }
}
```

**API Response:**
```json
{
  "suggestion": {
    "suggestion": "Pink cloud theme with gentle animations",
    "reasoning": "Matches Hello Kitty's soft, comforting aesthetic",
    "preview": "Soft pink backgrounds with floating white clouds and subtle sparkles"
  }
}
```

---

## Architecture Benefits

### Separation of Concerns
Each agent has a clear, focused responsibility:
- **Companion** handles emotional support
- **Career** handles professional guidance
- **Quest** handles learning activities
- **Reflection** handles journaling
- **Safety** handles moderation
- **World** handles customization

### Specialized Prompts
Each agent has tailored system instructions optimized for its task.

### Independent Scaling
Agents can be updated, scaled, or replaced independently.

### Clear Error Handling
Each endpoint handles failures gracefully with helpful error messages.

### Testable
Each agent can be tested in isolation with specific inputs.

## API Endpoints Summary

| Agent | Endpoint | Method | Purpose |
|-------|----------|--------|---------|
| Companion | `/api/chat` | POST | Conversation responses |
| Career Navigator | `/api/career` | POST | Career roadmaps |
| Quest/Learning | `/api/quest` | POST | Educational activities |
| Reflection | `/api/reflection-prompt` | POST | Journaling prompts |
| Community Safety | `/api/safety-review` | POST | Content moderation |
| World Builder | `/api/world-suggestion` | POST | Customization ideas |

## Worker Implementation

### File Structure
```
worker/
├── agents.ts          # Main 6-agent implementation
├── index.ts           # Entry point and routing
├── env.d.ts          # TypeScript definitions
├── mantra-agent.ts   # Legacy agent (kept for reference)
└── tsconfig.json     # TypeScript config
```

### Key Features
- ✅ Single worker handles all 6 agents
- ✅ Shared authentication middleware
- ✅ Consistent JSON response format
- ✅ Comprehensive error handling
- ✅ Health check endpoint (`GET /`)
- ✅ Request validation
- ✅ Conversation history support (Companion)
- ✅ JSON mode for structured responses

### Environment Variables
```env
AI_MODEL=@cf/meta/llama-3.1-8b-instruct  # Default model
AGENT_TOKEN=your-secret-token             # Optional auth
```

## Testing the Agents

### Local Development
```bash
cd worker
npm install
npm run dev  # Starts on http://localhost:8787
```

### Health Check
```bash
curl http://localhost:8787/
```

Response:
```json
{
  "status": "ok",
  "agents": ["companion", "career", "quest", "reflection", "safety", "world"],
  "timestamp": "2026-10-26T13:49:00.000Z"
}
```

### Test Companion Agent
```bash
curl -X POST http://localhost:8787/companion \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I'm feeling stressed about finals",
    "companionName": "Spider-Man",
    "displayName": "Alex"
  }'
```

### Test Career Agent
```bash
curl -X POST http://localhost:8787/career \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "I want to become a software engineer",
    "displayName": "Alex"
  }'
```

## Integration with Next.js App

### Frontend → Backend → Worker Flow

1. **User Action** (e.g., sends chat message)
2. **Frontend** calls Next.js API route (`/api/chat`)
3. **API Route** validates input, adds authentication
4. **API Route** calls Worker endpoint (`/companion`)
5. **Worker** runs AI model with agent-specific prompt
6. **Worker** returns JSON response
7. **API Route** validates and forwards response
8. **Frontend** displays result to user

### Error Handling Chain

Each layer handles errors appropriately:
- **Worker:** AI failures, timeout, invalid requests
- **API Route:** Worker unavailable, validation errors
- **Frontend:** Network errors, display user-friendly messages

## Security Considerations

### Authentication
- Optional bearer token authentication
- Token checked before AI invocation
- Prevents unauthorized usage

### Input Validation
- Request body type checking
- String length limits
- Sanitized before AI call

### Output Validation
- JSON parsing with error handling
- Response structure validation
- No raw AI output without checks

### Rate Limiting
- Handled at Cloudflare Workers level
- Per-IP or per-token limits configurable

## Future Enhancements

### Potential Additions
- [ ] Agent response caching for common queries
- [ ] Multi-turn conversation state management
- [ ] Agent-to-agent communication
- [ ] Custom model selection per agent
- [ ] Streaming responses for long outputs
- [ ] Fine-tuned models per agent
- [ ] Usage analytics and monitoring
- [ ] A/B testing different prompts

### Optimization Opportunities
- [ ] Response caching layer
- [ ] Request batching
- [ ] Model warm-up strategies
- [ ] Cost monitoring per agent

## Metrics & Monitoring

### Key Metrics to Track
- Response time per agent
- Success/error rates
- Token usage per agent
- User satisfaction ratings
- Crisis detection rate (Companion)
- Moderation accuracy (Safety)

## Conclusion

✅ **Phase 4 Complete:** All 6 AI agents implemented with:
- Specialized system prompts
- Clear responsibilities
- Complete API endpoints
- Comprehensive documentation
- Production-ready architecture

The agent system is modular, testable, and ready for deployment.
