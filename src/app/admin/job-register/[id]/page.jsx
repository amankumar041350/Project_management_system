'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jobDescription: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'jobDescription',
  });

  useEffect(() => {
    const fetchJob = async () => {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();

      if (res.ok) {
        const formatDate = (dateString) =>
          dateString ? new Date(dateString).toISOString().split('T')[0] : '';

        const formattedData = {
          ...data.data,
          dateOfReceiving: formatDate(data.data.dateOfReceiving),
          pdcDate: formatDate(data.data.pdcDate),
          adcDate: formatDate(data.data.adcDate),
          startDate: formatDate(data.data.startDate),
          endDate: formatDate(data.data.endDate),
          reportDate: formatDate(data.data.reportDate),
        };

        reset(formattedData);
        setLoading(false);
      } else {
        toast.error('Failed to load job data');
        router.push('/admin/job-register');
      }
    };

    if (id) fetchJob();
  }, [id, reset, router]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update job');

      toast.success('Job updated successfully');
      setTimeout(() => router.push('/admin/job-register'), 1200);
    } catch (err) {
      console.error(err);
      toast.error('Error updating job');
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow mt-8 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Edit Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Sticker Number</label>
            <input {...register('stickerNumber', { required: true })} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Job Number</label>
            <input {...register('jobNumber', { required: true })} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">SRF Number</label>
            <input {...register('srfNumber', { required: true })} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Date of Receiving</label>
            <input type="date" {...register('dateOfReceiving')} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">PDC Date</label>
            <input type="date" {...register('pdcDate')} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">ADC Date</label>
            <input type="date" {...register('adcDate')} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Start Date</label>
            <input type="date" {...register('startDate')} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">End Date</label>
            <input type="date" {...register('endDate')} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Report Date</label>
            <input type="date" {...register('reportDate')} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Certificate Number</label>
            <input {...register('certificateNumber')} className="w-full p-3 border rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Cycle Number</label>
            <input
              type="number"
              min="1"
              {...register('cycleNumber', { valueAsNumber: true, min: 1 })}
              className="w-full p-3 border rounded-lg text-gray-800"
            />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-800">Item</label>
                <input {...register(`jobDescription.${index}.item`)} className="w-full p-2 border rounded-lg text-gray-800" />
              </div>
              <div>
                <label className="text-sm text-gray-800">Model</label>
                <input {...register(`jobDescription.${index}.model`)} className="w-full p-2 border rounded-lg text-gray-800" />
              </div>
              <div>
                <label className="text-sm text-gray-800">Serial No</label>
                <input {...register(`jobDescription.${index}.serialNo`)} className="w-full p-2 border rounded-lg text-gray-800" />
              </div>
              <div>
                <label className="text-sm text-gray-800">Make</label>
                <input {...register(`jobDescription.${index}.make`)} className="w-full p-2 border rounded-lg text-gray-800" />
              </div>
              <div className="col-span-full text-right">
                <button type="button" onClick={() => remove(index)} className="text-red-600 text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => append({})} className="text-blue-600 font-medium mt-2">
            + Add Another Description
          </button>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
          >
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
}
