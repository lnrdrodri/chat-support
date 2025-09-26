# Chat Support – Frontend

The goal is to implement an omnichannel chat interface where clients (human agents) can monitor, collaborate, and take over conversations managed by AI.

## 📦 Tech Stack

- [Nuxt 3](https://nuxt.com/) (Vue 3 + SSR/SPA)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Pinia](https://pinia.vuejs.org/) for state management
- WebSockets (for real-time messaging)

## ⚙️ How to Run the Project

### 1. Prerequisites

- Node.js (>= 22)
- npm, yarn, or pnpm

### 2. Installation

```bash
# clone the repository
git clone https://github.com/lnrdrodri/chat-support.git
cd chat-support

# install dependencies
npm install
```

### 3. Development

```bash
npm run dev
```

Application available at: `http://localhost:3000`

### 4. Production Build

```bash
npm run build
npm run preview
```

## ✨ Implemented Features

- **Chat List:** list of available conversations with unread message counter.
- **Message View:** displays conversation history when selecting a chat.
- **Message Differentiation:** visually distinguishes messages sent by **customer** (`user1`, `user2`...), **AI** (`bot_user`), and **human agent** (`agent_leonardo`).
- **Send Messages:** the logged-in human agent can send new messages.
- **Real-time Updates:** via WebSocket to receive new messages and presence ("typing...").

## 🔧 Decisions & Trade-offs

- **State Management (Pinia):** Chose Pinia for its simplicity and integration with Vue 3. Centralizing state makes it easier to handle conversations and real-time messages.
- **Styling with Tailwind:** Accelerates UI development and ensures consistency.
- **Message Component:** Rendered dynamically based on message type and sender. This makes it easier to add new message types in the future.
- **Folder Structure:** Prioritized modularity and scalability, creating folders such as `stores`, `plugins`, `types`, and `utils`.
- **WebSocket Connections:** Had to open multiple WebSocket connections to enable the typing/status animation in the chat list. Ideally, a single connection should send the chat ID within the message, but this was the solution I found to make the feature work with the provided backend.
- **Last Message:** Initially chose not to display the last message of each chat on load, because the endpoint that returns all chats doesn’t provide that information. It would require making a request for each chat to fetch the last message, so I opted to leave it out initially and then fill it in once the chat is opened or a new message arrives via socket.
- **Message History:** Had to render the message history on the `client-side` because scrolling behavior is managed by manipulating a `ref` on an `HTMLElement` along with store data. This forced me to handle it client-side to avoid `hydration node mismatch` issues.

## 🚀 Possible Improvements

- Improve animations and micro-interactions (e.g., message entry, status indicators).
- Support sending multiple message types (images, audio).
- Implement message read receipts (not developed due to API issues).
- Better error UX (e.g., feedback when message sending fails - toast/alerts).
- Unit and integration tests.
- Implement composables to better centralize business logic.
