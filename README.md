# Pear Media AI Prototype

This is the Pear Media Lab AI prototype addressing the assignment to build a responsive web application that bridges the gap between simple user inputs and advanced AI outputs through two specific logic flows.

## Features

1. **Workflow A (Creative Studio - Text)**
   - Takes a simple text input from the user.
   - Enhances it using the **Gemini 1.5 Flash API** acting as a Prompt Engineer.
   - Allows the user to review and edit the enhanced prompt.
   - Generates an image using an **Image Generation API** (Hugging Face / Open proxy).
   
2. **Workflow B (Style Lab - Image)**
   - Allows the user to upload a source image.
   - Uses **Gemini 1.5 Flash Vision** to reverse-engineer the image (identify subjects, color palette, lighting, style).
   - Generates a stylistic variation prompt automatically based on the analysis.
   - Generates a completely new image variation using the Image Generation API.

## Project Architecture

This application uses a modular, React-based frontend structure built with Vite and TailwindCSS for modern, scalable styling.

```
pearmedia-ai-prototype/
├── .env                    # Secret API Keys (create this file)
├── .gitignore              # Files to ignore
├── README.md               # Project documentation
├── package.json            # Dependencies
├── tailwind.config.js      # Configuration for TailwindCSS
└── src/
    ├── App.jsx             # State management & Main Layout
    ├── main.jsx            # Entry point
    ├── index.css           # Global Tailwind imports & custom CSS layer
    ├── components/         # Modular UI elements
    │   ├── Navbar.jsx      # Navigation UI
    │   ├── WorkflowText.jsx# Input, Enhance, Approve, Generate logic for text
    │   ├── WorkflowImage.jsx# Upload, Analyze, Variation logic for image
    │   └── ImageCard.jsx   # Result display
    └── utils/              # API and constants
        ├── apiHelpers.js   # Fetch wrappers for Gemini Text, Vision, and Image Gen
        └── constants.js    # System prompts & shared strings
```

## Setup & Run Locally

### 1. Requirements
- Node.js (v18+)
- VITE & npm 

### 2. Installation
Clone the repository, navigate into the directory, and run:
```bash
npm install
```

### 3. API Keys (.env)
Create a `.env` file at the root of the project with the following keys. Without these keys, the system may fall back on demo error responses or free proxy endpoints, but using the keys natively will give the best results natively.
```env
# Required for Text and Image Analysis:
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional (for Image Generation via HF API):
VITE_HF_TOKEN=your_huggingface_token
```
*Note: If `VITE_HF_TOKEN` isn't set, the app will fall back to an open, proxy REST endpoint to emulate image generation.*

### 4. Running the Dev Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

## Deployment Instructions (Vercel / Netlify / GitHub Pages)

1. Connect your GitHub repository to your host of choice.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Add the **Environment Variables** (`VITE_GEMINI_API_KEY`) to the platform's dashboard so your production build can work securely.

## Demo Video

*Embed or link your Loom / OBS demonstration video right here.*
