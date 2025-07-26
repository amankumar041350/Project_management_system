'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ListChecks, CheckCircle } from 'lucide-react';

export default function InternTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch('/api/tasks/pending');
    const data = await res.json();

    if (res.ok) {
      setTasks(data.tasks);
    } else {
      toast.error(data.error || 'Failed to fetch tasks');
    }

    setLoading(false);
  };
  const markAsCompleted = async (taskId) => {
    const res = await fetch(`/api/tasks/${taskId}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ taskId }),
      
    });


    const data = await res.json();
    if (res.ok) {
      toast.success('Task marked as completed');
      fetchTasks();
    } else {
      toast.error(data.error || 'Failed to mark as completed');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-800 p-2 rounded-full mb-2">
            <ListChecks size={48} />
          </div>
          <p className="font-semibold">Pending Tasks</p>
        </div>
        <nav className="space-y-4">
          <a href="/intern/dashboard" className="block text-sm hover:underline">Dashboard</a>
          <a href="/intern/profile" className="block text-sm hover:underline">Profile</a>
        </nav>
      </aside>

      {/* Tasks Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Pending Tasks</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-green-600">🎉 All tasks completed!</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  {task.deadline && (
                    <p className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                  )}
                </div>
                <button
                  onClick={() => markAsCompleted(task._id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  <CheckCircle size={16} />
                  Mark as Completed
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
