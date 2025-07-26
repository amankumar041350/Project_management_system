'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ReportRegisterPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState('recent');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (res.ok) {
        setReports(data.data);
      } else {
        toast.error('Failed to fetch reports');
      }
    } catch (err) {
      toast.error('An error occurred while fetching');
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted successfully');
        fetchReports();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('An error occurred while deleting');
    }
  };

  const filteredReports = reports
    .filter((r) => {
      if (fromDate && new Date(r.srfDate) < new Date(fromDate)) return false;
      if (toDate && new Date(r.srfDate) > new Date(toDate)) return false;
      if (searchTerm && !(
        r.srfNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
      )) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortKey === 'srf') return a.srfNumber.localeCompare(b.srfNumber);
      if (sortKey === 'job') return a.jobNumber.localeCompare(b.jobNumber);
      if (sortKey === 'description') return a.itemDescription.localeCompare(b.itemDescription);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-blue-800">📋 Report Register</h1>
        <Link
          href="/admin/report-register/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg"
        >
          + Add New Report
        </Link>
      </div>

      <div className="bg-gray-100 p-6 rounded-xl shadow mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-800">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border px-3 py-2 rounded-lg text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border px-3 py-2 rounded-lg text-gray-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              placeholder="SRF, Job No, Description"
              className="border px-3 py-2 rounded-lg text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="border px-3 py-2 rounded-lg text-gray-800"
            >
              <option value="recent">Recently Added</option>
              <option value="srf">Sort by SRF No</option>
              <option value="job">Sort by Job No</option>
              <option value="description">Sort by Description</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading reports...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-800">
          {filteredReports.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
              <h2 className="text-xl font-bold text-blue-700 mb-3">SRF No: {r.srfNumber}</h2>
              <ul className="space-y-1 text-sm">
                <li><strong>Serial No:</strong> {r.serialNo}</li>
                <li><strong>SRF Date:</strong> {new Date(r.srfDate).toLocaleDateString()}</li>
                <li><strong>Job No:</strong> {r.jobNumber}</li>
                <li><strong>Job Date:</strong> {new Date(r.jobDate).toLocaleDateString()}</li>
                <li><strong>Description:</strong> {r.itemDescription}</li>
                <li><strong>Test Report No:</strong> {r.testReportNumber}</li>
                <li><strong>Test Report Date:</strong> {new Date(r.testReportDate).toLocaleDateString()}</li>
                <li><strong>ADC Date:</strong> {new Date(r.adcDate).toLocaleDateString()}</li>
                <li>
                  <strong>Report File:</strong>{' '}
                  {r.reportFileUrl ? (
                    <a href={r.reportFileUrl} target="_blank" className="text-blue-600 underline">View</a>
                  ) : (
                    '-'
                  )}
                </li>
              </ul>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push(`/admin/report-register/${r._id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteReport(r._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}