# SARIF Frontend

This document provides technical information about the internal **frontend module** of the SARIF project.

---

- [🔧 Overview](#-overview)
- [📁 Project Structure](#-project-structure)
- [📦 Build & Run](#-build--run)
- [🧩 Components & Managers](#-components--managers)
- [🕹️ Pong Game Integration](#-pong-game-integration)
- [🛠️ Environment](#-environment)

---

## 🔧 Overview

This is a **Single Page Application (SPA)** written in **TypeScript** and styled using **Tailwind CSS**. It is compiled using `npm run build` and the output is stored inside a Docker container at:

```
/var/www/sarif-frontend
```

The built frontend consists of:

- `/dist`: Compiled TypeScript output
- `/public`: `index.html` and static assets

The main HTML only contains the root `div`, all content is generated dynamically via the TypeScript code.

---

## 📁 Project Structure

> ⚠️ This structure is **not final** and may change during development.

- `srcs/components`: Contains reusable UI components using Tailwind.
- `srcs/managers`: Contains logic that orchestrates components and animations.
- `srcs/app.ts`: Main entry point for the application.

Animations are **only handled inside managers**, never in components.

---

## 📦 Build & Run

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

- Compiles TypeScript and Tailwind into the `/dist` folder.

### Development Mode (Hot Reload)

```bash
npm run dev
```

- Watches changes to `.ts` and `.css` files for live rebuilding.

### Running the Frontend

This module does **not** host a server by itself. You can either:

- Open `./public/index.html` manually in a browser.
- Or serve it using a local server. For example, using extension `live server` in vs-code.

---

## 🧩 Components & Managers

The project is organized into two main layers:

### 🧱 Components

- Located in `srcs/components`
- Build Tailwind-based HTML structures
- Should not contain no animation logic

### 🎮 Managers

- Located in `srcs/managers`
- Import components and handle logic + animations
- Responsible for building and controlling the visible UI

---

## 🕹️ Pong Game Integration

The Pong game (Transcendence project) will be rendered from the **`FrameManager`**.

You will need to:

- Create a new manager (e.g., `PongManager`)
- Register or call it inside `FrameManager` to display the game
- Routing is not yet implemented, it will be necessary to switch between the games and other UI elements

---

## 🛠️ Environment

This module is dockerized for deployment. Dockerfile builds the frontend and moves the result to:

```
/var/www/sarif-frontend
```

---

## 📝 Future Improvements

- Finalize directory structure
- Cleaner code organization
- Add routing
- Optimize component/manager separation
- Integrate better animation and asset handling
