'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function EditReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [existingFile, setExistingFile] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (id) {
      fetch(`/api/reports/${id}`)
        .then(res => res.json())
        .then(res => {
          const report = res.data;
          console.log(report)
          console.log(report.serialNo)
          if (report) {
            reset({
              serialNumber: report.serialNo || '',
              srfNumber: report.srfNumber || '',
              srfDate: report.srfDate ? report.srfDate.slice(0, 10) : '',
              jobNumber: report.jobNumber || '',
              jobDate: report.jobDate ? report.jobDate.slice(0, 10) : '',
              itemDescription: report.itemDescription || '',
              testReportNumber: report.testReportNumber || '',
              testReportDate: report.testReportDate ? report.testReportDate.slice(0, 10) : '',
              adcDate: report.adcDate ? report.adcDate.slice(0, 10) : '',
            });
            setExistingFile(report.reportFile || '');
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error('Failed to fetch report');
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'reportFile' && data[key]?.[0]) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success('Report updated successfully');
      setTimeout(() => router.push('/employee/report-register'), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update report');
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading report...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8 bg-white rounded-xl shadow text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Edit Report</h1>

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
            {existingFile && (
              <p className="text-sm text-gray-600 mt-1">
                Existing file: <a href={`/uploads/${existingFile}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{existingFile}</a>
              </p>
            )}
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow"
          >
            Update Report
          </button>
        </div>
      </form>
    </div>
  );
}
