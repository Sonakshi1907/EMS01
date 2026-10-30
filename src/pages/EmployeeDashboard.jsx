import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../context/TaskContext.jsx";

function EmployeeDashboard() {
  const { currentUser, logout } = useAuth();
  const { tasks, updateTaskStatus } = useTasks();

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

  const formatStatus = (status = "pending") =>
    status.charAt(0).toUpperCase() + status.slice(1);

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

        {myTasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          <div className="task-list">
            {myTasks.map((task) => (
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

                <div className="task-actions">
                  <button
                    type="button"
                    onClick={() => updateTaskStatus(task.id, "completed")}
                  >
                    Mark Completed
                  </button>

                  <button
                    type="button"
                    onClick={() => updateTaskStatus(task.id, "failed")}
                  >
                    Mark Failed
                  </button>
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
