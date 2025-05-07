# SARIF Frontend

This document provides technical information about the internal **frontend module** of the SARIF project.

---

- [🔧 Overview](#-overview)
- [📁 Project Structure](#-project-structure)
- [📦 Build & Run](#-build--run)
- [🧩 Components & Managers](#-components--managers)
- [🕹️ Pong Game Integration](#-pong-game-integration)
- [🛠️ Environment](#-environment)
- [🎨 Tailwind plugins](#-tailwind-plugins)
- [📝 How to contribute](#-how-to-contribute)

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
- `srcs/handlers`: Contains logic for specific tasks without UI interaction.
- `srcs/utilities`: Contains utility functions.
- `srcs/interfaces`: Contains TypeScript interfaces for reusability.
- `srcs/public`: Contains static assets (images, fonts, etc.).
- `srcs/public/assets/i18n`: Contains language json files for internationalization.
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

### 🛠️ Handlers
- Located in `srcs/handlers`
- Handle logic for specific tasks without directly interacting with the UI
- Should not contain any animation logic
- Should not import any components

### 🧰 Utilities
- Located in `srcs/utilities`
- Contains utility functions that can be used across the project

### 🗂️ Interfaces
- Located in `srcs/interfaces`
- Contains TypeScript interfaces that can be used across the project
- Should not contain any code logic
- Should mostly contain type definitions for reusability

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

## 🎨 Tailwind plugins

The frontend uses some Tailwind plugins to enhance the design:
- `@midudev/tailwind-animations`: Provides a set of pre-defined animations. (preview https://tailwindcss-animations.vercel.app/)
- `@tailwindcss/tailwind-scrollbar`: Adds custom scrollbar styles.

---

## 📝 How to contribute

You can add anything you want to the frontend, but please take a look at [these guidelines](#-project-structure) before doing so.

That being said, you can also directly contribute to adding language.

- Add a new language file in `public/assets/i18n/`
- Add the setting in `srcs/components/sidepanels/settingsSidePanel.ts` inside of
```typescript
const languages = ["English", "Spanish", "French", "Portuguese", "Russian"];
```

Make sure that the new json file begins with a lowercase letter, and that the setting name includes a capital letter for the first letter.

> ⚠️ The file naming might be changed in the future to match browser language settings. Don't worry about it for now, I will handle it.

---

## 📝 Future Improvements

- Finalize directory structure
- Cleaner code organization
- Add routing
- Optimize component/manager separation
- Integrate better animation and asset handling
