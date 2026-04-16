import { useState, useEffect } from "react";
import IssueCard from "./IssueCard";
import { getIssues, updateStatus } from "../services/api";

const SupervisorTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = { email: "supervisor1@gmail.com" }; // Mock user
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getIssues({ role: "supervisor", email: user.email });
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async (taskId) => {
    try {
      await updateStatus(taskId, { status: "In Progress" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkResolved = async (taskId) => {
    try {
      await updateStatus(taskId, { status: "Resolved" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No tasks assigned.</div>
      ) : tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <IssueCard
            category={task.category}
            description={task.description}
            status={task.status}
            location={task.location}
          />
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
            {task.status === "Open" && (
              <button
                onClick={() => handleStartWork(task.id)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Work
              </button>
            )}
            {task.status === "In Progress" && (
              <button
                onClick={() => handleMarkResolved(task.id)}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark Resolved
              </button>
            )}
            {task.status === "Resolved" && (
              <span className="flex-1 text-center text-sm text-green-600 font-medium py-2">
                Completed
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupervisorTaskList;
