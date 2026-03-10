import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        dueDate: "",
    });

    const fetchTasks = (selectedFilter = filter) => {
        setLoading(true);

        let url = "http://localhost:8080/api/tasks";

        if (selectedFilter === "active") {
            url += "?completed=false";
        } else if (selectedFilter === "completed") {
            url += "?completed=true";
        } else if (selectedFilter === "overdue") {
            url += "?overdue=true";
        }

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch tasks");
                }
                return res.json();
            })
            .then((data) => {
                setTasks(data);
                setError("");
            })
            .catch(() => {
                setError("Could not load tasks. Is the Spring app running?");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTasks(filter);
    }, [filter]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleComplete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${id}/complete`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                console.error('Failed to complete task');
                return;
            }

            const updatedTask = await response.json();

            setTasks((prev) =>
                prev.map((t) => (t.id === id ? updatedTask : t))
            );
        } catch (err) {
            console.error('Error completing task:', err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newTask.title.trim()) {
            alert("Title is required");
            return;
        }

        const payload = {
            title: newTask.title,
            description: newTask.description,
            dueDate: newTask.dueDate || null,
            completed: false,
        };

        fetch("http://localhost:8080/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to create task");
                }
                return res.json();
            })
            .then(() => {
                setNewTask({
                    title: "",
                    description: "",
                    dueDate: "",
                });
                fetchTasks(filter);
            })
            .catch((err) => {
                console.error(err);
                alert("Error creating task. Check console/logs.");
            });
    };

    const handleClearCompleted = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/tasks/completed", {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to clear completed tasks");
            }

            fetchTasks(filter);
        } catch (err) {
            console.error(err);
            alert("Could not clear completed tasks.");
        }
    };

    const handleClearOverdue = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/tasks/overdue", {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to clear overdue tasks");
            }

            fetchTasks(filter);
        } catch (err) {
            console.error(err);
            alert("Could not clear overdue tasks.");
        }
    };

    return (
        <div className="app">
            <div className="app-shell">
                <header className="app-header">
                    <div>
                        <h1>Task Manager</h1>
                    </div>
                </header>

                <main className="app-main">
                    {}
                    <section className="card">
                        <h2>Add New Task</h2>

                        <form className="task-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <label htmlFor="title">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={newTask.title}
                                    onChange={handleChange}
                                    placeholder="Enter title"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newTask.description}
                                    onChange={handleChange}
                                    placeholder="Optional details"
                                    rows={3}
                                />
                            </div>

                            <div className="form-row inline">
                                <div>
                                    <label htmlFor="dueDate">Due Date</label>
                                    <input
                                        id="dueDate"
                                        type="date"
                                        name="dueDate"
                                        value={newTask.dueDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn primary">
                                Create Task
                            </button>
                        </form>
                    </section>
                    <section className="card">
                        <div className="card-header">
                            <h2>Tasks</h2>
                            {loading && <span className="chip">Loading…</span>}
                        </div>

                        <div className="task-toolbar">
                            <div className="filter-group">
                                <button
                                    type="button"
                                    className={`btn filter-btn ${filter === "all" ? "active-filter" : ""}`}
                                    onClick={() => setFilter("all")}
                                >
                                    All
                                </button>

                                <button
                                    type="button"
                                    className={`btn filter-btn ${filter === "active" ? "active-filter" : ""}`}
                                    onClick={() => setFilter("active")}
                                >
                                    Active
                                </button>

                                <button
                                    type="button"
                                    className={`btn filter-btn ${filter === "completed" ? "active-filter" : ""}`}
                                    onClick={() => setFilter("completed")}
                                >
                                    Completed
                                </button>

                                <button
                                    type="button"
                                    className={`btn filter-btn ${filter === "overdue" ? "active-filter" : ""}`}
                                    onClick={() => setFilter("overdue")}
                                >
                                    Overdue
                                </button>
                            </div>

                            <div className="clear-group">
                                <button
                                    type="button"
                                    className="btn danger-btn"
                                    onClick={handleClearCompleted}
                                >
                                    Clear Completed
                                </button>

                                <button
                                    type="button"
                                    className="btn danger-btn"
                                    onClick={handleClearOverdue}
                                >
                                    Clear Overdue
                                </button>
                            </div>
                        </div>

                        {error && <p className="error">{error}</p>}

                        {!loading && !error && tasks.length === 0 && (
                            <p className="empty-state">No tasks yet. Add one above 👆</p>
                        )}

                        {!loading && !error && tasks.length > 0 && (
                            <ul className="task-list">
                                {tasks.map((task) => {
                                    const isOverdue =
                                        task.dueDate &&
                                        !task.completed &&
                                        new Date(task.dueDate) < new Date();

                                    return (
                                        <li
                                            key={task.id}
                                            className={`task-item ${
                                                task.completed ? "task-completed" : ""
                                            }`}
                                        >
                                            <div className="task-main">
                                                <div className="task-header-row">
                                                    <h3>{task.title}</h3>

                                                    <span
                                                        className={
                                                            task.completed
                                                                ? "chip success"
                                                                : isOverdue
                                                                ? "chip danger"
                                                                : "chip subtle"
                                                        }
                                                    >
                                                        {task.completed
                                                            ? "Completed"
                                                            : isOverdue
                                                            ? "Past Due"
                                                            : "Pending"}
                                                    </span>
                                                </div>

                                                {task.description && (
                                                    <p className="task-description">
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div className="task-meta">
                                                    {task.dueDate && (
                                                        <span className="chip subtle">
                                                            Due {task.dueDate}
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    className="btn secondary"
                                                    onClick={() => handleComplete(task.id)}
                                                    disabled={task.completed}
                                                >
                                                    {task.completed ? "Done" : "Mark Complete"}
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default App;
