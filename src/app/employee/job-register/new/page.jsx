'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AddEmployeeJobPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { jobDescription: [{}] } });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'jobDescription',
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create job');

      toast.success('Job added successfully');
      router.push('/employee/job-register');
    } catch (err) {
      console.error(err);
      toast.error('Error creating job');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow mt-8 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Add New Job</h1>

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
          <Input type="number" min={1} label="Cycle Number" name="cycleNumber" register={register} />
          {errors.cycleNumber && (
            <p className="text-sm text-red-600 mt-1">
              Cycle number must be a positive value.
            </p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Job Description</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <Input label="Item" name={`jobDescription.${index}.item`} register={register} />
              <Input label="Model" name={`jobDescription.${index}.model`} register={register} />
              <Input label="Serial No" name={`jobDescription.${index}.serialNo`} register={register} />
              <Input label="Make" name={`jobDescription.${index}.make`} register={register} />
              <div className="col-span-full text-right">
                <button type="button" onClick={() => remove(index)} className="text-red-600 text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({})}
            className="text-blue-600 font-medium"
          >
            + Add Another Description
          </button>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
          >
            Save Job
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
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 text-gray-800"
      />
    </div>
  );
}
