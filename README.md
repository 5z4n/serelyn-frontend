# Serelyn

AI emotional companion — chat interface with live backend integration.

## Chat integration (iMessage-style)

- **`src/Chat.jsx`** — Main chat UI: conversation state, bubbles, loading, emotion tags, New Chat / Logout / Home.
- **`src/Chat.css`** — Styles (palette: #EBF4DD, #90AB8B, #5A7863, #3B4953).
- **App:** After login, users see `Chat` instead of the old dashboard. `App.jsx` imports `Chat` and renders it when `page === "dashboard"` with `user`, `onLogout`, and `onNavigateHome`.

### Environment

Copy `.env.example` to `.env` and set:

- `REACT_APP_SUPABASE_URL` / `REACT_APP_SUPABASE_ANON_KEY` — auth.
- `REACT_APP_API_URL` — Render backend base URL (no trailing slash), e.g. `https://your-app.onrender.com`.

### API usage

Every user message is sent to the Render backend:

```http
POST {REACT_APP_API_URL}/analyze
Content-Type: application/json

{
  "user_id": 0,
  "text": "user message"
}
```

Response:

```json
{
  "emotion": "happy | sad | anxious | stressed | angry | neutral",
  "response": "LLM generated supportive text"
}
```

`user_id` is read from `localStorage` (from Supabase auth); if not a number, `0` is sent. The chat shows a “Serelyn is thinking...” bubble until the response is received, then replaces it with the real message and emotion tag.

### Deploy on Vercel

1. Push your code to GitHub and import the repo in [Vercel](https://vercel.com).
2. **Required:** In the project go to **Settings → Environment Variables** and add (for **Production** and **Preview**):
   - `REACT_APP_SUPABASE_URL` = your real Supabase URL, e.g. `https://YOUR-PROJECT-REF.supabase.co` (not `your-project.supabase.co`)
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key (from Supabase dashboard → Settings → API)
   - `REACT_APP_API_URL` = your Render backend URL, e.g. `https://serelyn-backend.onrender.com` (no trailing slash)
3. **Redeploy:** After saving the variables, go to **Deployments** → open the latest deployment → **⋯** → **Redeploy** (env vars are applied on the next build).
4. The build uses `npm run build` and outputs the `build` folder. If the deploy fails, check the build logs and fix the error.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
