'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function EmployeeTopbar({ onSearchResults }) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const [tasksRes, projectsRes] = await Promise.all([
        fetch(`/api/dashboard/tasks?search=${encodeURIComponent(query)}`),
        fetch(`/api/dashboard/projects?search=${encodeURIComponent(query)}`),
      ]);

      const tasks = await tasksRes.json();
      const projects = await projectsRes.json();

      if (onSearchResults) {
        onSearchResults({
          tasks: tasks.tasks || [],
          projects: projects.projects || [],
        });
      }
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="h-20 px-6 flex items-center justify-center bg-blue-50 shadow-sm border-b border-blue-100">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-2 shadow-sm">
          <input
            type="text"
            placeholder="Search tasks or projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-blue-800 placeholder-blue-400 text-sm px-2"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-100 text-blue-600 hover:bg-blue-200 transition p-2 rounded-full"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
