'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function AddReportPage() {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'reportFile' && data[key]?.[0]) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to add report');

      toast.success('Report added successfully');
      reset();
      setTimeout(() => router.push('/admin/report-register'), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Error adding report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8 bg-white rounded-xl shadow text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Add New Report</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Serial Number</label>
            <input type="text" {...register('serialNumber', { required: true })} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">SRF Number</label>
            <input type="text" {...register('srfNumber', { required: true })} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">SRF Date</label>
            <input type="date" {...register('srfDate')} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Job Number</label>
            <input type="text" {...register('jobNumber', { required: true })} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Job Date</label>
            <input type="date" {...register('jobDate')} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-1">Item Description</label>
            <textarea {...register('itemDescription')} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Test Report Number</label>
            <input type="text" {...register('testReportNumber')} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Test Report Date</label>
            <input type="date" {...register('testReportDate')} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">ADC Date</label>
            <input type="date" {...register('adcDate')} className="w-full p-3 border rounded text-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Upload Report</label>
            <input type="file" {...register('reportFile')} className="w-full p-3 border rounded text-gray-800" />
          </div>
        </div>

        <div className="pt-6">
          <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow">
            {submitting ? 'Submitting...' : 'Add Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
