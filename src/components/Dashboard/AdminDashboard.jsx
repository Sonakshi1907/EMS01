import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";
import { getFromStorage } from "../../utils/localStorage.js";

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Validate task title
    if (!trimmedTitle) {
      setMessage("Task title cannot be empty or contain only spaces.");
      return;
    }

    // Validate employee selection
    const employeeExists = employees.some(
      (employee) => employee.email === assignedTo,
    );

    if (!employeeExists) {
      setMessage("Please select a valid employee.");
      return;
    }

    // Validate due date
    if (!dueDate) {
      setMessage("Please select a due date.");
      return;
    }

    // Ensure the selected employee and date are valid
    const selectedDate = new Date(`${dueDate}T00:00:00`);
    if (Number.isNaN(selectedDate.getTime())) {
      setMessage("Please enter a valid due date.");
      return;
    }

    const taskDetails = {
      title: trimmedTitle,
      description: trimmedDescription,
      assignedTo,
      dueDate,
    };

    if (isEditing) {
      updateTask(editingTaskId, taskDetails);
      setMessage("Task updated successfully!");
    } else {
      addTask(taskDetails);
      setMessage("Task assigned successfully!");
    }

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
    setEditingTaskId(null);
    setIsEditing(false);
  };

  return (
    <div className="dashboard-shell">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`app-sidebar ${isSidebarOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        <a
          href="#overview"
          className="sidebar-brand"
          onClick={() => setIsSidebarOpen(false)}
        >
          <span className="brand-icon" aria-hidden="true">
            ✳
          </span>
          <span>
            <strong>TaskFlow</strong>
            <small>EMPLOYEE MANAGEMENT</small>
          </span>
        </a>

        <nav className="sidebar-nav">
          <a
            href="#overview"
            className="sidebar-link active"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span aria-hidden="true">▦</span>
            Dashboard
          </a>

          <a
            href="#tasks"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span aria-hidden="true">▤</span>
            Assigned Tasks
          </a>

          <a
            href="#employees"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span aria-hidden="true">♙</span>
            Employees
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-avatar" aria-hidden="true">
            {(currentUser?.name || "A").charAt(0).toUpperCase()}
          </span>
          <div className="sidebar-user">
            <strong>{currentUser?.name || "Admin"}</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      {/* Main dashboard */}
      <main className="dashboard dashboard-content" id="overview">
        <header className="dashboard-header">
          <div className="header-title">
            <button
              type="button"
              className="mobile-menu-button"
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen((open) => !open)}
            >
              ☰
            </button>

            <div>
              <p className="page-eyebrow">WORKSPACE / ADMIN</p>
              <h1>Dashboard Overview</h1>
              <p>Welcome back, {currentUser?.name || "Admin"}!</p>
            </div>
          </div>

          <button type="button" className="logout-button" onClick={logout}>
            Logout
          </button>
        </header>

        <section className="dashboard-stats" aria-label="Task statistics">
          <article className="stat-card">
            <span className="stat-icon stat-icon-blue" aria-hidden="true">
              ▤
            </span>
            <h3>Total Tasks</h3>
            <p>{tasks.length}</p>
          </article>

          <article className="stat-card">
            <span className="stat-icon stat-icon-amber" aria-hidden="true">
              ◷
            </span>
            <h3>Pending</h3>
            <p>{pendingTasks}</p>
          </article>

          <article className="stat-card">
            <span className="stat-icon stat-icon-green" aria-hidden="true">
              ✓
            </span>
            <h3>Completed</h3>
            <p>{completedTasks}</p>
          </article>

          <article className="stat-card">
            <span className="stat-icon stat-icon-red" aria-hidden="true">
              ×
            </span>
            <h3>Failed</h3>
            <p>{failedTasks}</p>
          </article>
        </section>

        <section className="task-form-section" id="assign-task">
          <div className="section-heading">
            <div>
              <h2>{isEditing ? "Edit Task" : "Assign a New Task"}</h2>
              <p>Create an assignment for one of your employees.</p>
            </div>
          </div>

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

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {isEditing ? "Save Changes" : "Assign Task"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {message && (
              <p className="form-message" role="status" aria-live="polite">
                {message}
              </p>
            )}
          </form>
        </section>

        <section className="assigned-tasks" id="tasks">
          <div className="section-heading">
            <div>
              <h2>Assigned Tasks</h2>
              <p>Manage and track tasks assigned to your team.</p>
            </div>
            <span className="task-count">{filteredTasks.length} tasks</span>
          </div>

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

          <p className="results-count">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>

          {filteredTasks.length === 0 ? (
            <p className="empty-state">
              {tasks.length === 0
                ? "No tasks yet. Assign your first task above."
                : "No tasks match your current filters."}
            </p>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <div className="task-card-heading">
                    <h3>{task.title}</h3>
                    <span
                      className={`status-badge status-${task.status || "pending"}`}
                    >
                      {task.status || "pending"}
                    </span>
                  </div>

                  <p>
                    <strong>Assigned to:</strong> {getEmployeeName(task)}
                  </p>

                  {task.description && <p>{task.description}</p>}

                  {task.dueDate && (
                    <p>
                      <strong>Due date:</strong> {task.dueDate}
                    </p>
                  )}

                  <div className="task-card-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleEdit(task)}
                    >
                      Edit Task
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(task)}
                    >
                      Delete Task
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="employees-section" id="employees">
          <div className="section-heading">
            <div>
              <h2>Employees</h2>
              <p>People currently registered in your workspace.</p>
            </div>
            <span className="task-count">{employees.length} employees</span>
          </div>

          {employees.length === 0 ? (
            <p className="empty-state">No employees found.</p>
          ) : (
            <ul className="employee-list">
              {employees.map((employee) => (
                <li key={employee.id}>
                  <span className="employee-avatar" aria-hidden="true">
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="employee-details">
                    <strong>{employee.name}</strong>
                    <span>{employee.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="dashboard-footer">
          Employee Management System · Admin Workspace
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
