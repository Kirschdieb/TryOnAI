# TryOnAI

## Project Structure

```
TryOnAI/
├── .git/                       # Git repository directory
├── .gitignore                  # Git ignore file for excluding files from version control
├── README.md                   # Project documentation and overview
├── eslint.config.js            # ESLint configuration for code linting
├── index.html                  # Main HTML entry point for the application
├── logo.png                    # Project logo image
├── node_modules/               # Node.js dependencies
├── package-lock.json           # Exact versions of npm dependencies
├── package.json                # Project metadata and dependencies
├── postcss.config.js           # PostCSS configuration for CSS processing
├── public/                     # Static public assets
│   └── ...
├── server/                     # Backend server code
│   ├── .env                    # Environment variables for server configuration
│   ├── index.js                # Main server file, likely handling API routes and logic
│   ├── node_modules/           # Server-specific dependencies
│   ├── package-lock.json       # Server dependency versions
│   ├── package.json            # Server dependency configuration
│   ├── temp/                   # Temporary directory for server operations
│   └── zalando-puppeteer.js    # Script for web scraping with Puppeteer for Zalando
├── src/                        # Frontend source code
│   ├── App.css                 # CSS styles for the main App component
│   ├── App.jsx                 # Main React component for the application
│   ├── assets/                 # Static assets like images or fonts
│   │   └── ...
│   ├── components/             # Reusable UI components
│   │   ├── layout/             # Components related to layout structure
│   │   │   ├── Footer.jsx      # Footer component for page layout
│   │   │   ├── MobileDrawer.jsx # Mobile navigation drawer component
│   │   │   └── Navbar.jsx      # Navigation bar component for the application
│   │   ├── pages/              # Components representing full pages or views
│   │   │   ├── Closet.jsx      # Page component for managing user's closet or collection
│   │   │   ├── HomeUpload.jsx  # Home page with upload functionality
│   │   │   └── TryOnStudio.jsx # Main studio page for virtual try-on feature
│   │   └── ui/                 # Basic UI elements and widgets
│   │       ├── Button.jsx      # Reusable button component
│   │       ├── Card.jsx        # Reusable card component for displaying content
│   │       └── DropZone.jsx    # Component for file upload drop zone
│   ├── index.css               # Global CSS styles
│   ├── main.jsx                # Entry point for React application
│   ├── routes.jsx              # Route definitions for navigation
│   ├── store/                  # State management (possibly Redux or similar)
│   │   └── ...
│   └── tailwind.css            # Tailwind CSS configuration or custom styles
├── tailwind.config.js          # Tailwind CSS configuration file
└── vite.config.js              # Vite configuration for build and development server
```

# React + Vite

## Project Setup

This project consists of a React frontend (client) and a Node.js backend (server).

### Installation

To install all dependencies for both the client and the server, run the following command in the root directory:

```bash
npm run install:all
```

### Running the Development Server

To start both the frontend and backend servers concurrently, use:

```bash
npm run dev
```

This will typically start the frontend on `http://localhost:5173` and the backend on `http://localhost:3000`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## About TryOnAI

**TryOnAI** is a web application designed to allow users to virtually try on clothing items. It aims to provide a seamless experience from uploading images to generating and viewing the virtual try-on results.

### Core Features:

1.  **Home & Upload (`/` - `HomeUpload.jsx`):**
    *   Allows users to upload a photo of themselves.
    *   Provides options to upload a photo of a clothing item or paste a URL from Zalando.
    *   Collects the necessary inputs for the virtual try-on process.

2.  **Try-On Studio (`/studio` - `TryOnStudio.jsx`):**
    *   Displays the user's photo alongside the selected clothing item.

### Available Scripts

In the project directory, you can run the following commands:

#### `npm install`

Installs all the project dependencies. This is typically the first command you run after cloning the repository or when new dependencies are added.

#### `npm run dev`

Starts the development server (usually on `http://localhost:5173`).
The app will automatically reload if you make changes to the code.
You will see any build errors or lint warnings in the console.

#### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified, and the filenames include hashes for caching.

#### `npm run preview`

Locally serves the production build from the `dist` folder. This command is useful for verifying the build before deployment. It should be run after `npm run build`.
    *   Includes an area for users to provide custom prompts or instructions for the AI (optional).
    *   Features a "Generate Try-On" button.
    *   **Note:** Currently, the AI generation is simulated with a placeholder (`fakeGenerate` function) that uses the clothing photo as the result and adds it to the Closet.

3.  **Virtual Closet (`/closet` - `Closet.jsx`):**
    *   Displays a gallery of all previously generated and saved try-on outfits.
    *   Allows users to click on an outfit to view it in a larger modal/dialog.

### Technology Stack:

*   **Frontend Library/Framework:** React
*   **Build Tool & Development Server:** Vite
*   **Routing:** React Router DOM
*   **State Management:** Zustand
*   **Styling:** Tailwind CSS with DaisyUI component library

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
