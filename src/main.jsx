import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { initialUsers, initialTasks } from "./utils/initialData";
import { getFromStorage, saveToStorage } from "./utils/localStorage";

import { AuthProvider } from "./context/AuthContext.jsx";

const users = getFromStorage("users");

if (!users) {
  saveToStorage("users", initialUsers);
}

const tasks = getFromStorage("tasks");

if (!tasks) {
  saveToStorage("tasks", initialTasks);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
