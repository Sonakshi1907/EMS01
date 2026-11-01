import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";

function EmployeeDashboard() {
  const { currentUser, logout } = useAuth();
  const { tasks, updateTaskStatus } = useTasks();

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
    <main className="dashboard employee-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Employee Dashboard</h1>
          <p>Welcome, {currentUser.name}</p>
        </div>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="dashboard-stats">
        <article className="stat-card">
          <h3>Total Tasks</h3>
          <p>{myTasks.length}</p>
        </article>

        <article className="stat-card">
          <h3>Completed</h3>
          <p>{completedTasks.length}</p>
        </article>

        <article className="stat-card">
          <h3>Pending</h3>
          <p>{pendingTasks.length}</p>
        </article>

        <article className="stat-card">
          <h3>Failed</h3>
          <p>{failedTasks.length}</p>
        </article>
      </section>

      <section className="assigned-tasks">
        <h2>My Tasks</h2>

        <div className="task-filters">
          <input
            type="search"
            placeholder="Search tasks by title or description..."
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

        <p>
          Showing {filteredTasks.length} of {myTasks.length} tasks
        </p>

        {filteredTasks.length === 0 ? (
          <p>
            {myTasks.length === 0
              ? "No tasks assigned yet."
              : "No tasks match your search or filter."}
          </p>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <article className="task-card" key={task.id}>
                <h3>{task.title}</h3>

                <p>
                  <strong>Description:</strong>{" "}
                  {task.description?.trim() || "No description provided."}
                </p>

                <p>
                  <strong>Status:</strong> {formatStatus(task.status)}
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

                <div className="task-actions">
                  {task.status !== "completed" && (
                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, "completed")}
                    >
                      Mark Completed
                    </button>
                  )}

                  {task.status !== "failed" && (
                    <button
                      type="button"
                      onClick={() => updateTaskStatus(task.id, "failed")}
                    >
                      Mark Failed
                    </button>
                  )}

                  {task.status !== "pending" && (
                    <button
                      type="button"
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
    </main>
  );
}

export default EmployeeDashboard;
