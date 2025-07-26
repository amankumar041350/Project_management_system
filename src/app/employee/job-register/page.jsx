'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeJobRegisterPage() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    srfNumber: '',
    cycleNumber: '',
    from: '',
    to: '',
    keyword: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data.data || []);
        setFiltered(data.data || []);
      });
  }, []);

  useEffect(() => {
    const { srfNumber, cycleNumber, from, to, keyword } = filters;
    let result = [...jobs];

    if (srfNumber) {
      result = result.filter(j => j.srfNumber?.includes(srfNumber));
    }
    if (cycleNumber) {
      result = result.filter(j => String(j.cycleNumber) === cycleNumber);
    }
    if (from) {
      result = result.filter(j => new Date(j.startDate) >= new Date(from));
    }
    if (to) {
      result = result.filter(j => new Date(j.endDate) <= new Date(to));
    }
    if (keyword) {
      result = result.filter(j =>
        j.jobDescription?.some(d =>
          Object.values(d).some(v => String(v).toLowerCase().includes(keyword.toLowerCase()))
        )
      );
    }

    setFiltered(result);
  }, [filters, jobs]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setJobs(prev => prev.filter(j => j._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-blue-800">📘 Job Register</h1>
          <button
            onClick={() => router.push('/employee/job-register/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
          >
            + Add Job
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-100 p-6 rounded-xl shadow mb-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-gray-800">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">SRF Number</label>
              <input
                value={filters.srfNumber}
                onChange={(e) => setFilters({ ...filters, srfNumber: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Cycle Number</label>
              <input
                value={filters.cycleNumber}
                onChange={(e) => setFilters({ ...filters, cycleNumber: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">From Start Date</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">To End Date</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col md:col-span-5">
              <label className="text-sm font-medium mb-1">Job Description Keyword</label>
              <input
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-800">
          {filtered.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-2xl shadow-lg border hover:shadow-xl transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-blue-700">{job.jobNumber} - {job.srfNumber}</h2>
                  <p className="text-sm text-gray-600">Received: {job.dateOfReceiving?.slice(0,10)}</p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                  <li><strong>Sticker:</strong> {job.stickerNumber}</li>
                  <li><strong>Cycle:</strong> {job.cycleNumber}</li>
                  <li><strong>Certificate No:</strong> {job.certificateNumber}</li>
                  <li><strong>PDC Date:</strong> {job.pdcDate?.slice(0,10)}</li>
                  <li><strong>ADC Date:</strong> {job.adcDate?.slice(0,10)}</li>
                  <li><strong>Start Date:</strong> {job.startDate?.slice(0,10)}</li>
                  <li><strong>End Date:</strong> {job.endDate?.slice(0,10)}</li>
                  <li><strong>Report Date:</strong> {job.reportDate?.slice(0,10)}</li>
                </ul>
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-1">Job Description:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {job.jobDescription?.map((desc, idx) => (
                      <li key={idx}>
                        <span className="font-medium">Item:</span> {desc.item},
                        <span className="font-medium"> Model:</span> {desc.model},
                        <span className="font-medium"> Serial No:</span> {desc.serialNo},
                        <span className="font-medium"> Make:</span> {desc.make}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => router.push(`/employee/job-register/${job._id}`)}
                  className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
