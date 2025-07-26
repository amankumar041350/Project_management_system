'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditEmployeeJobPage() {
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
        alert('Failed to load job data');
        router.push('/employee/job-register');
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

      alert('Job updated successfully');
      router.push('/employee/job-register');
    } catch (err) {
      console.error(err);
      alert('Error updating job');
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow mt-8 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Edit Job</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input label="Sticker Number" name="stickerNumber" register={register} required />
          <Input label="Job Number" name="jobNumber" register={register} required />
          <Input label="SRF Number" name="srfNumber" register={register} required />
          <Input type="date" label="Date of Receiving" name="dateOfReceiving" register={register} />
          <Input type="date" label="PDC Date" name="pdcDate" register={register} />
          <Input type="date" label="ADC Date" name="adcDate" register={register} />
          <Input type="date" label="Start Date" name="startDate" register={register} />
          <Input type="date" label="End Date" name="endDate" register={register} />
          <Input type="date" label="Report Date" name="reportDate" register={register} />
          <Input label="Certificate Number" name="certificateNumber" register={register} />
          <Input
            type="number"
            min={1}
            label="Cycle Number"
            name="cycleNumber"
            register={register}
          />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <Input label="Item" name={`jobDescription.${index}.item`} register={register} />
              <Input label="Model" name={`jobDescription.${index}.model`} register={register} />
              <Input label="Serial No" name={`jobDescription.${index}.serialNo`} register={register} />
              <Input label="Make" name={`jobDescription.${index}.make`} register={register} />
              <div className="col-span-full text-right">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 text-sm"
                >
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

function Input({ label, name, register, type = 'text', ...rest }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
      <input
        type={type}
        {...register(name)}
        {...rest}
        className="w-full p-3 border rounded-lg text-gray-800"
      />
    </div>
  );
}
