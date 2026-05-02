# Voter-saathi: Indian Election Assistant 🇮🇳

## Idea
"Voter-saathi" is a hyper-localized, conversational web application designed to empower Indian citizens during elections. Acting as an empathetic and highly accessible digital companion, it bridges the gap in election awareness—especially for First-Time Voters and Commuters. It is engineered with robust security protocols, an immersive user experience, and strict adherence to political neutrality as mandated by the Election Commission of India.

## Planning
The strategy was grounded in 6 crucial parameters:
1. **Code Quality:** Built using Vite + React with component-based architecture for maximum maintainability.
2. **Security:** Implemented `dompurify` to prevent XSS vulnerabilities within the AI-generated HTML content.
3. **Efficiency:** Developed with Vanilla CSS and optimized functional components to limit overhead and enforce a blazing fast DOM footprint.
4. **Testing:** Configured `Vitest` with `jsdom` to assure core logic engine resilience and deterministic fail-safes against political biases.
5. **Accessibility (WCAG):** Fully keyboard navigable, integrated with ARIA labels, semantic HTML, and high color-contrast ratio.
6. **Google Services:** Tightly integrated with Google Vertex AI / Gemini via deterministic system prompts, and Google Firebase for app analytics telemetry. Supported by a Docker-ready setup for Google Cloud Run deployment.

## Technical Specifications & Features
The application is structured around a highly scalable React architecture with offline-resilient AI logic.

### 1. Welcome Screen
A stateful interceptor (`WelcomeScreen.jsx`) that routes users based on their voting experience, setting up anonymous, PII-free session profiles.

### 2. Module A: The Foundation (Eligibility & Forms)
- **Age Eligibility Calculator:** Intercepts "Check Eligibility" queries to dynamically calculate age against the 4 mandatory ECI Cutoff Dates (Jan 1, Apr 1, Jul 1, Oct 1) entirely locally within `electionService.js`.
- **Form Finder Logic:** Strictly maps natural language intents to ECI Forms (Form 6, 7, 8).
- **Electoral Roll Constraint:** Natively instructs the AI to enforce that having an EPIC card is not enough; the name MUST be on the Electoral Roll.

### 3. Module B: Process Transparency (Timeline)
- **Interactive Visual Timeline:** Parses the `[SHOW_TIMELINE]` trigger from the AI to render the `ElectionTimeline.jsx` component, visually breaking down the 7 stages (Notification to Counting).
- **Model Code of Conduct:** Simplified logic explaining MCC as the "Fair Play" rules for politicians.

### 4. Module C: The Booth (Walkthrough & Accessibility)
- **Virtual Booth Simulator:** Parses the `[SHOW_BOOTH]` trigger to render the `BoothWalkthrough.jsx` component.
- **Text-to-Speech (TTS):** Implements the native Web Speech API (`window.speechSynthesis`) to provide audio-guided instructions for each stage of the booth.
- **The 7-Second Rule:** Strictly enforces the VVPAT verification window explanation.

### 5. Secure Backend Proxy 
- **Node.js/Express Backend:** The application uses a secure backend proxy (`server/index.js`).
- **Identity-Based Auth:** Leveraging **Google Cloud Run Service Accounts** and the `@google-cloud/vertexai` SDK, the agent authenticates via `gcloud auth` (IAM) rather than static API keys.
- **Graceful Degradation:** If the backend is unreachable or the network drops, a robust local regex fallback matcher in the frontend seamlessly takes over, ensuring the core "Timeline", "Booth", and "Forms" features remain 100% functional offline.

## Getting Started
1. Install dependencies: `npm install`
2. Create your `.env.local` based on `.env.sample`.
   - *Note: For local development, you still use an API key. For production/Cloud Run, the app automatically switches to secure IAM-based auth.*
3. Run local server: `npm run dev`
4. Run production server locally: `npm run build && npm start`
5. Run tests: `npm run test`

## Docker Build (Google Cloud Run)
```bash
docker build -t voter-saathi .
docker run -p 8080:80 voter-saathi
```
