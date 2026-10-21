BERRY AI STUDIO — AI CHAT DEPLOYMENT

This package adds real AI Chat and AI Writer using a Netlify Function and OpenRouter.

IMPORTANT
- Keep your OpenRouter key private. Never put it in index.html or commit it to a repository.
- Configure it in Netlify as OPENROUTER_API_KEY for Functions.
- The function uses model router `openrouter/free`; availability and free limits can change.
- Image, video, voice, and coding are still planning demos.

DEPLOY
1. Extract this ZIP and keep the folder structure intact.
2. For Netlify Functions, deploy this project from a Git repository connected to Netlify (recommended). A simple static drag-and-drop upload does not run functions.
3. Confirm the Netlify environment variable OPENROUTER_API_KEY is set.
4. Trigger a new deploy.
5. Visit https://berryaistudio.netlify.app, choose AI Chat, enter a question, and click Create draft.
