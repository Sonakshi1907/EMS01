import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";

function EmployeeDashboard() {
  const { currentUser, logout } = useAuth();
  const { tasks, updateTaskStatus } = useTasks();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (!currentUser) {
    return <p>Please login to continue.</p>;
  }

  const myTasks = (tasks || []).filter(
    (task) =>
      String(task.assignedTo) === String(currentUser.id) ||
      task.assignedTo === currentUser.email,
  );

  const completedTasks = myTasks.filter((task) => task.status === "completed");
  const failedTasks = myTasks.filter((task) => task.status === "failed");
  const pendingTasks = myTasks.filter((task) => task.status === "pending");

  const filteredTasks = myTasks.filter((task) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      (task.title || "").toLowerCase().includes(search) ||
      (task.description || "").toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatStatus = (status = "pending") =>
    status.charAt(0).toUpperCase() + status.slice(1);

  const isOverdue = (task) => {
    if (!task.dueDate || task.status !== "pending") {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${task.dueDate}T00:00:00`);

    return dueDate < today;
  };

  return (
    <div className="dashboard-shell">
      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`app-sidebar ${isSidebarOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        <a
          href="#employee-overview"
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
            href="#employee-overview"
            className="sidebar-link active"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span aria-hidden="true">▦</span>
            Dashboard
          </a>

          <a
            href="#my-tasks"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span aria-hidden="true">▤</span>
            My Tasks
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </span>
          <div className="sidebar-user">
            <strong>{currentUser.name}</strong>
            <small>Employee</small>
          </div>
        </div>
      </aside>

      <main className="dashboard dashboard-content" id="employee-overview">
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
              <p className="page-eyebrow">WORKSPACE / EMPLOYEE</p>
              <h1>My Dashboard</h1>
              <p>Welcome back, {currentUser.name}!</p>
            </div>
          </div>

          <button type="button" className="logout-button" onClick={logout}>
            Logout
          </button>
        </header>

        <section className="dashboard-stats">
          <article className="stat-card">
            <span className="stat-icon stat-icon-blue">▤</span>
            <h3>Total Tasks</h3>
            <p>{myTasks.length}</p>
          </article>

          <article className="stat-card">
            <span className="stat-icon stat-icon-green">✓</span>
            <h3>Completed</h3>
            <p>{completedTasks.length}</p>
          </article>

          <article className="stat-card">
            <span className="stat-icon stat-icon-amber">◷</span>
            <h3>Pending</h3>
            <p>{pendingTasks.length}</p>
          </article>

          <article className="stat-card">
            <span className="stat-icon stat-icon-red">×</span>
            <h3>Failed</h3>
            <p>{failedTasks.length}</p>
          </article>
        </section>

        <section className="assigned-tasks" id="my-tasks">
          <div className="section-heading">
            <div>
              <h2>My Tasks</h2>
              <p>View and manage your assigned work.</p>
            </div>

            <span className="task-count">{filteredTasks.length} tasks</span>
          </div>

          <div className="task-filters">
            <input
              type="search"
              placeholder="Search your tasks..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search my tasks"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter tasks by status"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <p className="results-count">
            Showing {filteredTasks.length} of {myTasks.length} tasks
          </p>

          {filteredTasks.length === 0 ? (
            <p className="empty-state">
              {myTasks.length === 0
                ? "No tasks assigned yet."
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
                      {formatStatus(task.status)}
                    </span>
                  </div>

                  <p>
                    <strong>Description:</strong>{" "}
                    {task.description?.trim() || "No description provided."}
                  </p>

                  {task.dueDate && (
                    <p>
                      <strong>Due date:</strong> {task.dueDate}
                    </p>
                  )}

                  {isOverdue(task) && (
                    <p className="overdue-label" role="status">
                      Overdue — deadline has passed
                    </p>
                  )}

                  <div className="task-card-actions">
                    {task.status !== "completed" && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => updateTaskStatus(task.id, "completed")}
                      >
                        Mark Completed
                      </button>
                    )}

                    {task.status !== "failed" && (
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => updateTaskStatus(task.id, "failed")}
                      >
                        Mark Failed
                      </button>
                    )}

                    {task.status !== "pending" && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => updateTaskStatus(task.id, "pending")}
                      >
                        Reset to Pending
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          Employee Management System · Employee Workspace
        </footer>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
