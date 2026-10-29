# CivicAssist AI

CivicAssist AI is an AI-powered civic assistance platform designed to help citizens access public-service information, understand grievance procedures, submit civic complaints within the platform, and track their status.

> **Transparency Notice:** CivicAssist AI is an independent civic-technology project. Unless an official government integration is configured, grievances submitted through this platform are not automatically delivered to government departments.

## Features

- **Public Services Directory:** Search and explore public-service information.
- **AI Assistant:** Get guidance on civic services and grievance procedures.
- **Grievance Submission:** Submit structured complaints and receive a unique reference ID.
- **Complaint Tracking:** Check grievance status and review available timelines.
- **Citizen Dashboard:** View grievances associated with your account.
- **Admin Console:** Manage grievance statuses through authorized staff workflows.
- **Multilingual Support:** English, Telugu, Hindi, Kannada, and Tamil.
- **Authentication and Database:** Firebase Authentication and Cloud Firestore.

## Tech Stack

- React
- TypeScript
- Vite
- Firebase Authentication
- Cloud Firestore
- Gemini API

## Getting Started

### Prerequisites

- Node.js
- npm
- Firebase project configuration
- Gemini API key for AI-powered responses

### Installation

Clone the repository:

```bash
git clone https://github.com/AmruthaBingi/CivicAssist-AI.git
cd CivicAssist-AI
```

Install dependencies:

```bash
npm install
```

Configure the required environment variables and Firebase settings. Refer to `.env.example` for the server environment variables.

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Check `package.json` for the available scripts and follow the configuration requirements for your deployment environment.

## Security

- Never commit API keys, private credentials, or `.env` files.
- Review Firebase Authentication and Firestore Security Rules before deployment.
- Use synthetic data for public demonstrations.
- Do not rely on frontend restrictions alone to protect private information.
- Do not represent the application as an official government portal without authorization.

## Project Structure

- `src/` — Frontend application
- `server.ts` — Server-side routes and AI integration
- `firestore.rules` — Firestore security rules
- `firebase-applet-config.json` — Firebase app configuration
- `.env.example` — Environment variable template

## Maintainer

**Amrutha Bingi**

GitHub: https://github.com/AmruthaBingi

## License

No license has been specified yet. Add a license file if you intend to grant others permission to reuse or redistribute this project.
