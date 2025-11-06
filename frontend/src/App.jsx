import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed to load");
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setError("");
      })
      .catch(() => {
        setError("Could not load tasks. Is Spring Boot running on the correct port?");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Task Manager (React)</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>{" "}
              {task.completed ? "✅" : ""}
              {task.description ? ` — ${task.description}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
