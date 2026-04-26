# Voter-saathi: Indian Election Assistant 🇮🇳

## Idea
"Voter-saathi" is a hyper-localized, conversational web application designed to empower Indian citizens during elections. Acting as an empathetic and highly accessible digital companion, it bridges the gap in election awareness—especially for First-Time Voters and Commuters. It is engineered with robust security protocols, an immersive user experience, and strict adherence to political neutrality as mandated by the Election Commission of India.

## Planning
The strategy was grounded in 6 crucial parameters:
1. **Code Quality:** Built using Vite + React with component-based architecture for maximum maintainability.
2. **Security:** Implemented `dompurify` to prevent XSS vulnerabilities within the AI-generated HTML content, and an `.env` wrapper to shield API credentials.
3. **Efficiency:** Developed with Vanilla CSS and optimized functional components to limit overhead and enforce a blazing fast DOM footprint.
4. **Testing:** Configured `Vitest` with `jsdom` to assure core logic engine resilience and deterministic fail-safes against political biases.
5. **Accessibility (WCAG):** Fully keyboard navigable, integrated with ARIA labels, semantic HTML, and high color-contrast ratio.
6. **Google Services:** Tightly integrated with Google Vertex AI / Gemini via deterministic system prompts, and Google Firebase for app analytics telemetry. Supported by a Docker-ready setup for Google Cloud Run deployment.

## Execution & Code
- **UI Architecture:** 
  - `ChatWindow.jsx`: Handles chat cycles, scrolling mechanics, and state management.
  - `Message.jsx`: Responsibly renders text while mitigating security risks via DOM sanitization.
  - `QuickActions.jsx`: Frictionless query generation for improved accessibility without typing.
- **LLM Core Engine (`assistantLogic.js`):** 
  - Connects to Google Generative AI using a comprehensive System Prompt. 
  - Employs strict Regex patterns to catch and neutralize politically biased questions, delivering the mandated fallback: *"the choice of candidate is a secret and sacred decision..."*.

## Getting Started
1. Install dependencies: `npm install`
2. Create your `.env.local` based on `.env.sample` and provide your Vertex API and Firebase keys.
3. Run local server: `npm run dev`
4. Run tests: `npm run test`

## Docker Build (Google Cloud Run)
```bash
docker build -t voter-saathi .
docker run -p 8080:80 voter-saathi
```
