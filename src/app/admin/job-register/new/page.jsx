'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function AddJobPage() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { jobDescription: [{}] } });

  const { fields, append, remove } = useFieldArray({ control, name: 'jobDescription' });

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create job');
      router.push('/admin/job-register');
    } catch (err) {
      console.error(err);
      alert('Error creating job');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow mt-8 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Add New Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Sticker Number</label>
            <input {...register('stickerNumber', { required: true })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Number</label>
            <input {...register('jobNumber', { required: true })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SRF Number</label>
            <input {...register('srfNumber', { required: true })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Receiving</label>
            <input type="date" {...register('dateOfReceiving')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PDC Date</label>
            <input type="date" {...register('pdcDate')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ADC Date</label>
            <input type="date" {...register('adcDate')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" {...register('startDate')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input type="date" {...register('endDate')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Report Date</label>
            <input type="date" {...register('reportDate')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Certificate Number</label>
            <input {...register('certificateNumber')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cycle Number</label>
            <input type="number" min="1" {...register('cycleNumber', { valueAsNumber: true, min: 1 })} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" />
            {errors.cycleNumber && <p className="text-sm text-red-600 mt-1">Cycle number must be a positive value.</p>}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Job Description</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm">Item</label>
                <input {...register(`jobDescription.${index}.item`)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm">Model</label>
                <input {...register(`jobDescription.${index}.model`)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm">Serial No</label>
                <input {...register(`jobDescription.${index}.serialNo`)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm">Make</label>
                <input {...register(`jobDescription.${index}.make`)} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="col-span-full text-right">
                <button type="button" onClick={() => remove(index)} className="text-red-600 text-sm">Remove</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => append({})} className="text-blue-600 font-medium">+ Add Another Description</button>
        </div>

        <div className="pt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition">
            Save Job
          </button>
        </div>
      </form>
    </div>
  );
}
