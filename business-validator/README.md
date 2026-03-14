# Business Validator

A 7-phase business idea stress-testing tool built for Indian founders. Provide your idea and get a structured, honest analysis powered by AI.

---

## 🚀 Features

- 7-phase evaluation checklist for business idea validation
- Frontend UI to enter and review your idea
- Backend that calls Anthropic's API (via an API key)
- Fast development setup with a single command

---

## 🧩 Prerequisites

- Node.js 18+ (or the version required by `package.json`)
- An Anthropic API key

---

## 🛠️ Setup

1. Clone or copy this project.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file and add your Anthropic key:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and set:

   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. Start the app (frontend + backend):

   ```bash
   npm run dev
   ```

---

## ▶️ Usage

1. Open your browser at http://localhost:5173 (or the URL shown in the terminal).
2. Enter your business idea.
3. Review the AI-generated validation report.

---

## 📦 Project Structure

- `server.js` - backend server (API proxy to Anthropic)
- `src/` - React frontend source
- `public/` - static frontend assets
- `package.json` - scripts & dependencies

---

## 🧪 Common Scripts

- `npm run dev` - run frontend + backend in development
- `npm run build` - build the frontend for production
- `npm run preview` - preview the production build locally

---

## 🤝 Contributing

PRs welcome. Please ensure code formatting is consistent and add tests where appropriate.

---

## 🧾 License

This project is provided as-is. Update or add a license as needed.