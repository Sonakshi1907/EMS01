import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../context/TaskContext.jsx";

function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const { tasks, updateTaskStatus } = useTasks();

  if (!currentUser) {
    return <p>Please login to continue.</p>;
  }

  const myTasks = tasks.filter(
    (task) => Number(task.assignedTo) === Number(currentUser.id),
  );

  const completedTasks = myTasks.filter((task) => task.status === "completed");

  const failedTasks = myTasks.filter((task) => task.status === "failed");

  const pendingTasks = myTasks.filter((task) => task.status === "pending");

  return (
    <div className="employee-dashboard">
      <h1>Employee Dashboard</h1>
      <p>Welcome, {currentUser.name}</p>

      <section className="task-stats">
        <div>
          <h3>Total Tasks</h3>
          <p>{myTasks.length}</p>
        </div>

        <div>
          <h3>Completed</h3>
          <p>{completedTasks.length}</p>
        </div>

        <div>
          <h3>Pending</h3>
          <p>{pendingTasks.length}</p>
        </div>

        <div>
          <h3>Failed</h3>
          <p>{failedTasks.length}</p>
        </div>
      </section>

      <h2>My Tasks</h2>

      {myTasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        myTasks.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>

            {task.status === "pending" && (
              <div>
                <button onClick={() => updateTaskStatus(task.id, "completed")}>
                  Mark Completed
                </button>

                <button onClick={() => updateTaskStatus(task.id, "failed")}>
                  Mark Failed
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeDashboard;
