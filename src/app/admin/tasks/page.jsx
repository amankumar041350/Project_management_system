'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Pencil, Trash, CheckCircle, Clock, Search } from 'lucide-react';

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, searchText, startDate, endDate]);

  const fetchTasks = async () => {
    let query = [];
    if (statusFilter) query.push(`status=${statusFilter}`);
    if (searchText) query.push(`search=${searchText}`);
    if (startDate) query.push(`start=${startDate}`);
    if (endDate) query.push(`end=${endDate}`);
    const url = `/api/tasks${query.length ? '?' + query.join('&') : ''}`;

    const res = await fetch(url);
    const json = await res.json();
    setTasks(json.data || []);
  };

  const onSubmit = async (data) => {
    const endpoint = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks';
    const method = editingTask ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(editingTask ? 'Task updated' : 'Task created');
      reset();
      setEditingTask(null);
      fetchTasks();
    } else {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Task deleted');
      fetchTasks();
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setValue('title', task.title);
    setValue('description', task.description);
    setValue('deadline', task.deadline?.slice(0, 10));
    setValue('assignDate', task.assignDate?.slice(0, 10));
    setValue('status', task.status);
  };

  const toggleStatus = async (task) => {
    const updated = {
      ...task,
      status: task.status === 'pending' ? 'completed' : 'pending',
    };

    const res = await fetch(`/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      toast.success('Status updated');
      fetchTasks();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8">Task Management</h1>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search title or description"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-3 border rounded-lg text-gray-800 pl-10 shadow"
            />
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border rounded-lg text-gray-800 shadow"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border rounded-lg text-gray-800 shadow"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border rounded-lg text-gray-800 shadow"
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow mb-10 border border-gray-200"
      >
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Task Title</label>
          <input
            placeholder="Task Title"
            {...register('title', { required: true })}
            className="p-3 border rounded-lg text-gray-800 shadow"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Description</label>
          <input
            placeholder="Description"
            {...register('description', { required: true })}
            className="p-3 border rounded-lg text-gray-800 shadow"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Status</label>
          <select
            {...register('status')}
            className="p-3 border rounded-lg text-gray-800 shadow"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Deadline</label>
          <input
            type="date"
            {...register('deadline')}
            className="p-3 border rounded-lg text-gray-800 shadow"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Assign Date</label>
          <input
            type="date"
            {...register('assignDate')}
            className="p-3 border rounded-lg text-gray-800 shadow"
          />
        </div>

        <button
          type="submit"
          className="col-span-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl shadow-lg"
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      <div className="space-y-4">
        {tasks.map(task => (
          <div
            key={task._id}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-start hover:shadow-md border border-gray-200"
          >
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-1">{task.title}</h3>
              <p className="text-sm text-gray-700">{task.description}</p>
              <p className="text-sm mt-1"><strong>Status:</strong> {task.status}</p>
              <p className="text-sm"><strong>Deadline:</strong> {task.deadline?.slice(0, 10)}</p>
              <p className="text-sm"><strong>Assign Date:</strong> {task.assignDate?.slice(0, 10)}</p>
              {task.completedBy && (
                <p className="text-sm"><strong>Completed By:</strong> {task.completedBy}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleStatus(task)}
                className={`${task.status === 'pending' ? 'bg-yellow-500' : 'bg-green-600'} hover:opacity-90 text-white px-3 py-2 rounded shadow`}
              >
                {task.status === 'pending' ? <Clock size={18} /> : <CheckCircle size={18} />}
              </button>
              <button
                onClick={() => handleEdit(task)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded shadow"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded shadow"
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
