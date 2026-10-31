import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";
import { getFromStorage } from "../../utils/localStorage.js";

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  const storedUsers = getFromStorage("users");
  const users = Array.isArray(storedUsers) ? storedUsers : [];
  const employees = users.filter((user) => user.role === "employee");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesEmployee =
      employeeFilter === "all" || task.assignedTo === employeeFilter;

    return matchesSearch && matchesStatus && matchesEmployee;
  });

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setAssignedTo(task.assignedTo);
    setDueDate(task.dueDate || "");
    setIsEditing(true);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
    setIsEditing(false);
    setMessage("");
  };
  const handleDelete = (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) return;

    deleteTask(task.id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!title.trim() || !assignedTo || !dueDate) {
      setMessage("Please fill in the title, employee and due date.");
      return;
    }

    if (isEditing) {
      updateTask(editingTaskId, {
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        dueDate,
      });

      setMessage("Task updated successfully!");
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        dueDate,
      });

      setMessage("Task assigned successfully!");
    }

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
    setEditingTaskId(null);
    setIsEditing(false);

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

          <button type="submit">
            {isEditing ? "Save Changes" : "Assign Task"}
          </button>

          {isEditing && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}

          {message && (
            <p role="status" aria-live="polite">
              {message}
            </p>
          )}
        </form>
      </section>

      <section className="assigned-tasks">
        <h2>Assigned Tasks</h2>

        <div className="task-filters">
          <input
            type="search"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search tasks"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={employeeFilter}
            onChange={(event) => setEmployeeFilter(event.target.value)}
            aria-label="Filter by employee"
          >
            <option value="all">All Employees</option>

            {employees.map((employee) => (
              <option key={employee.id} value={employee.email}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <p>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>

        {filteredTasks.length === 0 ? (
          <p>No matching tasks found.</p>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <article className="task-card" key={task.id}>
                <h3>{task.title}</h3>
                <p>Assigned to: {getEmployeeName(task)}</p>
                <p>Status: {task.status}</p>

                {task.description && <p>{task.description}</p>}

                {task.dueDate && <p>Due date: {task.dueDate}</p>}
                <button type="button" onClick={() => handleEdit(task)}>
                  Edit Task
                </button>
                <button type="button" onClick={() => handleDelete(task)}>
                  Delete Task
                </button>
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
