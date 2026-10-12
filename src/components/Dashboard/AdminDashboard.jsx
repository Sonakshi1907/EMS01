import { useAuth } from "../../context/AuthContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const { tasks } = useTasks();

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const employees = users.filter((user) => user.role === "employee");

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
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
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
