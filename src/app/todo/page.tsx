"use client";

import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
  type Task,
} from "../functions";

export default function Home() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");
  const [editingContent, setEditingContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from Appwrite when the page opens
  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Add a task
  const addTask = async () => {
    if (title.trim() === "" || content.trim() === "") return;

    try {
      const newTask = await createTask(title, content);
      setTasks((currentTasks) => [newTask, ...currentTasks]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (index: number) => {
    const task = tasks[index];

    try {
      const updatedTask = await updateTask(task.$id, {
        completed: !task.completed,
      });

      setTasks((currentTasks) =>
        currentTasks.map((t) => (t.$id === updatedTask.$id ? updatedTask : t)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  // Delete a task
  const handleDeleteTask = async (index: number) => {
    const task = tasks[index];

    try {
      await deleteTask(task.$id);

      setTasks((currentTasks) =>
        currentTasks.filter((t) => t.$id !== task.$id),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  // Save an edited task
  const saveTask = async (index: number) => {
    const task = tasks[index];

    try {
      const updatedTask = await updateTask(task.$id, {
        title: editingTitle,
        content: editingContent,
      });

      setTasks((currentTasks) =>
        currentTasks.map((t) => (t.$id === updatedTask.$id ? updatedTask : t)),
      );

      setEditingIndex(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    }
  };

  const startEditing = (index: number): void => {
    setEditingIndex(index);
    setEditingTitle(tasks[index].title || "");
    setEditingContent(tasks[index].content || "");
  };

  const cancelEditing = (): void => {
    setEditingIndex(null);
  };

  if (loading) {
    return <div className="root-container">Loading tasks...</div>;
  }

  return (
    <div className="root-container">
      <div className="task-container">
        <h1 className="header">My Tasks</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col mb-6">
          <input
            type="text"
            className="input-field"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="input-field mt-2"
            placeholder="Task Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button onClick={addTask} className="edit-button mt-2">
            Add Task
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map((t, index) => (
            <li
              key={t.$id}
              className={`flex flex-col p-4 rounded-lg shadow-md ${
                t.completed ? "bg-green-100" : "bg-gray-100"
              } transition-all ease-in-out duration-200`}
            >
              <div className="flex items-center">
                {editingIndex !== index && (
                  <input
                    type="checkbox"
                    checked={!!t.completed}
                    onChange={() => toggleTaskCompletion(index)}
                    className="mr-2"
                  />
                )}

                {editingIndex === index ? (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      className="input-field"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />

                    <textarea
                      rows={4}
                      className="input-field mt-2"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        t.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {t.title}
                    </h2>

                    <p
                      className={`${
                        t.completed
                          ? "line-through text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {t.content}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex mt-2">
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={() => saveTask(index)}
                      className="save-button"
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEditing}
                      className="cancel-button ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(index)}
                      className="edit-button"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteTask(index)}
                      className="delete-button ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
