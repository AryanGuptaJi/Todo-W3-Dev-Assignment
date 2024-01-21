import React, { useState, useEffect } from "react";
import "./App.css";

interface Todo {
  _id: string;
  work: string;
  description: string;
}

const BASE_URL = "http://localhost:3001";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newWork, setNewWork] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const addTodo = () => {
    fetch(`${BASE_URL}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ work: newWork, description: newDescription }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewWork("");
        setNewDescription("");
      })
      .catch((error) => console.error("Error adding todo:", error));
  };

  const updateTodo = (id: string, work: string, description: string) => {
    fetch(`${BASE_URL}/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ work, description }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos(todos.map((todo) => (todo._id === id ? data : todo)));
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const deleteTodo = (id: string) => {
    fetch(`${BASE_URL}/api/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };

  return (
    <div className="app">
      <h1>ToDo App</h1>
      <div className="add-todo">
        <input
          type="text"
          placeholder="Work"
          value={newWork}
          onChange={(e) => setNewWork(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <input
              type="text"
              value={todo.work}
              onChange={(e) =>
                updateTodo(todo._id, e.target.value, todo.description)
              }
            />
            <input
              type="text"
              value={todo.description}
              onChange={(e) => updateTodo(todo._id, todo.work, e.target.value)}
            />
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
