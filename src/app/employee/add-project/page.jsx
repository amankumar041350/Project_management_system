'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmployeeAddProjectPage() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      reset();
      alert("Project added successfully");
      router.push('/employee/dashboard');
    } else {
      alert('Failed to submit project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Project</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">SRF Number</label>
              <input {...register('srfNumber', { required: true })} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Client Name</label>
              <input {...register('clientName', { required: true })} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Type</label>
              <select {...register('type', { required: true })} className="w-full p-3 border rounded-xl bg-white">
                <option value="">Select type</option>
                <option value="web">Web</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Cycle Number</label>
              <select {...register('cycleNumber', { required: true })} className="w-full p-3 border rounded-xl bg-white">
                <option value="">Select cycle</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Date of Start</label>
              <input type="date" {...register('dateOfStart', { required: true })} className="w-full p-3 border rounded-xl" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Deadline Date</label>
              <input type="date" {...register('deadlineDate', { required: true })} className="w-full p-3 border rounded-xl" />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Project Title</label>
              <input {...register('projectTitle', { required: true })} className="w-full p-3 border rounded-xl" />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Status</label>
              <select {...register('status')} className="w-full p-3 border rounded-xl bg-white">
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Description</label>
              <textarea {...register('description')} className="w-full p-3 border rounded-xl" rows={4} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {loading ? 'Submitting...' : 'Add Project'}
          </button>
        </form>
      </div>
    </div>
  );
}
