
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wait for the DOM to be fully loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element with id 'root' not found in the document. Check your index.html file.");
  }
});
