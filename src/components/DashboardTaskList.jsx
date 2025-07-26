'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DashboardTasksOverview() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/dashboard/tasks?status=${statusFilter}&search=${searchTerm}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTasks(data.tasks || []);
    } catch (err) {
      toast.error('Failed to fetch tasks');
    }
  };

  const handleSearch = () => {
    fetchTasks();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-6xl mx-auto h-[80vh] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Tasks Overview</h2>
        <div className="flex gap-2">
          {['pending', 'completed', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input with Icon Button */}
      <div className="relative w-full md:w-1/2 mb-4">
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Scrollable Task Cards */}
      <div className="overflow-y-auto pr-2 flex-1 space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="border border-gray-200 p-4 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              <p className="text-gray-700 mt-1">{task.description}</p>
              <div className="text-sm text-gray-500 mt-2">
                <p>Assigned: {new Date(task.assignDate).toLocaleDateString()}</p>
                <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              </div>
              <span
                className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
