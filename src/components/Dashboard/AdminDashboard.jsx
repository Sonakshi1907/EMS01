import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";
import { getFromStorage } from "../../utils/localStorage.js";

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const { tasks, addTask } = useTasks();

  const storedUsers = getFromStorage("users");
  const users = Array.isArray(storedUsers) ? storedUsers : [];
  const employees = users.filter((user) => user.role === "employee");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "pending").length;

  const failedTasks = tasks.filter((task) => task.status === "failed").length;

  const getEmployeeName = (task) => {
    const employee = employees.find(
      (user) => user.id === task.assignedTo || user.email === task.assignedTo,
    );

    return employee?.name || "Unknown employee";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!title.trim() || !assignedTo || !dueDate) {
      setMessage("Please fill in the title, employee and due date.");
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      assignedTo,
      dueDate,
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
    setMessage("Task assigned successfully!");
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {currentUser?.name || "Admin"}</p>
        </div>

        <button onClick={logout}>Logout</button>
      </header>

      <section className="dashboard-stats">
        <article className="stat-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </article>

        <article className="stat-card">
          <h3>Pending</h3>
          <p>{pendingTasks}</p>
        </article>

        <article className="stat-card">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </article>

        <article className="stat-card">
          <h3>Failed</h3>
          <p>{failedTasks}</p>
        </article>
      </section>

      <section className="task-form-section">
        <h2>Assign a New Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              placeholder="Describe the task"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="assigned-employee">Assign To</label>
            <select
              id="assigned-employee"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              required
            >
              <option value="">Select an employee</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.email}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-due-date">Due Date</label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={(event) => setDueDate(event.target.value)}
              required
            />
          </div>

          <button type="submit">Assign Task</button>

          {message && (
            <p role="status" aria-live="polite">
              {message}
            </p>
          )}
        </form>
      </section>

      <section className="assigned-tasks">
        <h2>Assigned Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks have been assigned yet.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className="task-card" key={task.id}>
                <h3>{task.title}</h3>
                <p>Assigned to: {getEmployeeName(task)}</p>
                <p>Status: {task.status}</p>

                {task.description && <p>{task.description}</p>}

                {task.dueDate && <p>Due date: {task.dueDate}</p>}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="employees-section">
        <h2>Employees</h2>

        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <ul>
            {employees.map((employee) => (
              <li key={employee.id}>
                {employee.name} — {employee.email}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
