'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectListPage() {
    const [projects, setProjects] = useState([]);
    const [display, setDisplay] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        cycleNumber: 'all',
        from: '',
        to: '',
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/projects')
            .then((res) => res.json())
            .then((data) => {
                setProjects(data.data || []);
                setDisplay(data.data || []);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let list = [...projects];
        const { search, status, from, to, cycleNumber } = filters;

        if (search) {
            const s = search.toLowerCase();
            list = list.filter(p =>
                p.srfNumber?.toLowerCase().includes(s) ||
                p.clientName?.toLowerCase().includes(s) ||
                p.projectTitle?.toLowerCase().includes(s)
            );
        }

        if (status !== 'all') {
            list = list.filter(p => p.status === status);
        }

        if (cycleNumber !== 'all') {
            list = list.filter(p => p.cycleNumber === parseInt(cycleNumber));
        }

        if (from) {
            list = list.filter(p => new Date(p.dateOfStart) >= new Date(from));
        }

        if (to) {
            list = list.filter(p => new Date(p.dateOfStart) <= new Date(to));
        }

        setDisplay(list);
    }, [filters, projects]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (res.ok) {
            const updated = projects.filter(p => p._id !== id);
            setProjects(updated);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-blue-500 rounded-2xl p-6 shadow-lg text-white">
                    <h1 className="text-4xl font-bold mb-2">Manage Your Projects here....</h1>
                    <p className="text-lg">Monitor and manage all your projects effectively.</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 items-end">
                    <div className="col-span-1 sm:col-span-2 flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Search</label>
                        <div className="relative">
                           
                            <input
                                type="text"
                                placeholder="Search SRF / Client / Title"
                                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm text-gray-800"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Status</label>
                        <select
                            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 text-gray-800"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Cycle Number</label>
                        <select
                            className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400 text-gray-800"
                            value={filters.cycleNumber}
                            onChange={(e) => setFilters({ ...filters, cycleNumber: e.target.value })}
                        >
                            <option value="all">All</option>
                            <option value="1">Cycle 1</option>
                            <option value="2">Cycle 2</option>
                            <option value="3">Cycle 3</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            className="p-3 rounded-lg border text-gray-800"
                            value={filters.from}
                            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            className="p-3 rounded-lg border text-gray-800"
                            value={filters.to}
                            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                        />
                    </div>
                </div>

                {/* Filter Summary */}
                {(filters.from && filters.to) && (
                    <p className="text-sm text-gray-600 px-2">
                        Showing projects from <strong>{filters.from}</strong> to <strong>{filters.to}</strong>
                    </p>
                )}

                {/* Project Cards */}
                {loading ? (
                    <p className="text-center text-gray-600">Loading projects...</p>
                ) : display.length === 0 ? (
                    <p className="text-center text-gray-600">No projects match your filters.</p>
                ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {display.map((p) => (
                            <div key={p._id} className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-blue-600 mb-2">{p.projectTitle}</h2>
                                    <p className="text-sm text-gray-600">SRF: <span className="font-medium">{p.srfNumber}</span></p>
                                    <p className="text-sm text-gray-600">Client: <span className="font-medium">{p.clientName}</span></p>
                                    <p className="text-sm text-gray-600">Status: <span className="capitalize font-medium">{p.status}</span></p>
                                    <p className="text-sm text-gray-600">Cycle: <span className="font-medium">{p.cycleNumber}</span></p>
                                    <p className="text-sm text-gray-600">Start Date: {p.dateOfStart?.slice(0, 10)}</p>
                                    <p className="text-sm text-gray-600">Deadline: {p.deadlineDate?.slice(0, 10)}</p>
                                    <p className="text-sm text-gray-700 mt-2">Description: <span className="text-gray-600">{p.description}</span></p>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => router.push(`project/edit-project/${p._id}`)}
                                        className="flex-grow py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-white transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        className="flex-grow py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
