# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Time Machine is a chat app that lets users converse with an AI persona roleplaying as a citizen of a chosen historical time period and region. It uses a local Ollama LLM (llama3) via a Flask backend, with a React frontend.

## Prerequisites

- [Ollama](https://ollama.com/) installed and running locally with a model (llama3 by default)
- Python 3 with `flask` and `flask_cors`
- Node.js / npm

## Running the App

All three commands must be running simultaneously:

```bash
ollama serve
```

```bash
cd server && python3 test.py
```

```bash
cd client && npm start
```

## Architecture

**Three-layer stack:**

1. **Ollama** — local LLM server at `http://localhost:11434`. The Flask server calls `/api/chat` with the full message history and a system prompt.

2. **Flask server** (`server/test.py`) — runs on port 5050. Exposes two endpoints:
   - `POST /api/session` — receives `{system_prompt}`, creates a new session (UUID key), stores the system prompt in server-side memory, returns `{session_id}`.
   - `POST /api/send` — receives `{value, session_id}`, appends the user message to the stored session context, applies the sliding window, calls Ollama, streams back SSE chunks (`data: {...}\n\n`), appends the assistant response to the session, and sends a final `{done: true}` event.

3. **React frontend** (`client/`) — Create React App using MUI for UI components. Chat UI is fully custom (no chatscope).

**State and data flow:**

- Conversation history lives **server-side** in a `sessions` dict keyed by UUID. The client only holds a `sessionIdRef` — each request sends `{value, session_id}`, a fixed-size payload regardless of conversation length.
- The server applies a **sliding window** on every request: it always keeps the system prompt (`context[0]`) and trims to the last 20 messages, preventing context window overflow.
- `SidebarComponent` constructs the system prompt and a human-readable `configLabel` (e.g. `"Roman Empire · 44 BCE · scholar and noble"`) client-side, then calls `onContextChange(systemPrompt, label)`.
- `changeContext` in `ChatWindowComponent` is async — it calls `POST /api/session` to create a new server session and only re-enables the input once the session ID is returned. This prevents sending a message before a session exists.
- `handleNewChat` (restart button) creates a fresh session with the stored `systemPromptRef` without requiring the user to reconfigure the sidebar.
- Streaming responses are handled via `ReadableStream` / `getReader()`. An `AbortController` ref cancels in-progress streams.

**Component overview:**

| File | Role |
|---|---|
| `ChatWindowComponent.js` | Root chat component. Owns `messages`, `loading`, `isConfigured`, `configLabel`. Session ID and system prompt stored as refs. Handles send, stop, restart, and context change. |
| `SidebarComponent.js` | Collects user config (region, year, tone). Provides preset chips. Calls `onContextChange` with system prompt + label. |
| `MessageListComponent.js` | Renders the message list. Shows empty state (unconfigured or configured-but-no-messages), typing dots while loading, and auto-scrolls to bottom. |
| `ChatInputComponent.js` | Auto-resizing textarea. Enter sends, Shift+Enter newlines. Shows stop button while streaming. |
| `InputComponent.js` | Dead code — not used anywhere. |

**Key behaviors:**
- The assistant bubble is not added until the first content chunk arrives (prevents ghost bubbles on failed requests).
- Stopping generation (`AbortController.abort()`) leaves the partial response in place.
- "Restart conversation" clears messages, cancels any active stream, and creates a new server session with the same time period.
- A 404 from `/api/send` (session not found, e.g. after server restart) surfaces as an error bubble rather than silently failing.
- Year input is clamped to `[-5000, current year]` on blur.

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| App background | `#1a1c22` | Outermost shell |
| Sidebar background | `#22252e` | Slightly lighter than app bg |
| Assistant bubble / input | `#2c2f3a` | Incoming message + textarea background |
| User bubble / accent | `#8fb996` | Outgoing message, buttons, focused borders |
| Accent hover | `#6a9672` | Button hover |
| Text primary | `#f0ead6` | Main text (warm off-white) |
| Text secondary | `rgba(240,234,214,0.55)` | Labels, placeholders, helper text |

## Client Commands

```bash
cd client
npm install    # install dependencies
npm start      # dev server (proxies API calls to localhost:5050)
npm run build  # production build
npm test       # run tests
```
