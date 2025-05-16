# React + Vite

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
