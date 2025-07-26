'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to fetch project');

        const project = data.project;
        console.log(project.srfNumber)

        // Reset form with formatted dates
        reset({
          srfNumber: project.srfNumber,
          clientName: project.clientName,
          type: project.type,
          cycleNumber: project.cycleNumber?.toString(),
          dateOfStart: project.dateOfStart?.slice(0, 10),
          deadlineDate: project.deadlineDate?.slice(0, 10),
          projectTitle: project.projectTitle,
          status: project.status,
          description: project.description,
        });
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProject();
  }, [id, reset]);

  const onSubmit = async (data) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('Project updated successfully');
      router.push('/admin/project');
    } else {
      const err = await res.json();
      alert(err.error || 'Update failed');
    }
  };

  if (loading) return <p className="text-center py-10">Loading project data...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Project</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-1">SRF Number</label>
              <input {...register('srfNumber')} className="w-full p-3 border rounded-xl" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Client Name</label>
              <input {...register('clientName')} className="w-full p-3 border rounded-xl" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Type</label>
              <select {...register('type')} className="w-full p-3 border rounded-xl bg-white">
                <option value="">Select type</option>
                <option value="web">Web</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Cycle Number</label>
              <select {...register('cycleNumber')} className="w-full p-3 border rounded-xl bg-white">
                <option value="">Select cycle</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Date of Start</label>
              <input type="date" {...register('dateOfStart')} className="w-full p-3 border rounded-xl" />
            </div>

            <div>
              <label className="block font-semibold mb-1">Deadline Date</label>
              <input type="date" {...register('deadlineDate')} className="w-full p-3 border rounded-xl" />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1">Project Title</label>
              <input {...register('projectTitle')} className="w-full p-3 border rounded-xl" />
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
            className="w-full py-3 mt-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Update Project
          </button>
        </form>
      </div>
    </div>
  );
}
