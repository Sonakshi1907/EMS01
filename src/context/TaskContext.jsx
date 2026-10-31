import { createContext, useContext, useEffect, useState } from "react";

import { getFromStorage, saveToStorage } from "../utils/localStorage.js";

const TaskContext = createContext(null);

const VALID_STATUSES = ["pending", "completed", "failed"];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = getFromStorage("tasks");

    return Array.isArray(storedTasks) ? storedTasks : [];
  });

  // Jab bhi tasks change hon, LocalStorage update hoga.
  useEffect(() => {
    saveToStorage("tasks", tasks);
  }, [tasks]);

  // Admin ke through naya task assign karna.
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: crypto.randomUUID(),
      status: "pending",
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);

    return newTask;
  };

  // Employee task ka status update kar sakta hai.
  const updateTaskStatus = (taskId, newStatus) => {
    if (!VALID_STATUSES.includes(newStatus)) {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  // Admin existing task ki details edit kar sakta hai.
  const updateTask = (taskId, updatedDetails) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedDetails } : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId),
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }

  return context;
}

export default TaskContext;
