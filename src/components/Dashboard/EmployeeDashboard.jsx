import { useAuth } from "../../context/AuthContext.jsx";
import { useTasks } from "../../context/TaskContext.jsx";

function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const { tasks } = useTasks();

  const myTasks = tasks.filter(
    (task) =>
      task.assignedTo === currentUser?.id ||
      task.assignedTo === currentUser?.email,
  );

  const completed = myTasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pending = myTasks.filter((task) => task.status === "pending").length;

  const failed = myTasks.filter((task) => task.status === "failed").length;

  return (
    <main className="dashboard">
      <h1>Employee Dashboard</h1>
      <p>Welcome, {currentUser?.name || "Employee"}</p>

      <section className="dashboard-stats">
        <article className="stat-card">
          <h3>Total Tasks</h3>
          <p>{myTasks.length}</p>
        </article>

        <article className="stat-card">
          <h3>Completed</h3>
          <p>{completed}</p>
        </article>

        <article className="stat-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </article>

        <article className="stat-card">
          <h3>Failed</h3>
          <p>{failed}</p>
        </article>
      </section>

      <section>
        <h2>My Tasks</h2>

        {myTasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          myTasks.map((task) => (
            <article key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default EmployeeDashboard;
