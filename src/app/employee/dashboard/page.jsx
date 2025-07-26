'use client';

import { useState } from 'react';
import EmployeeSidebar from '@/components/EmployeeSidebar';
import EmployeeTopbar from '@/components/EmployeeTopbar';
import DashboardTasksOverview from '@/components/DashboardTaskList';

export default function EmployeeDashboardPage() {
  const [searchResults, setSearchResults] = useState(null);

  return (
    <div className="flex min-h-screen">
      <EmployeeSidebar />
      <main className="flex-1 bg-gray-100">
        <EmployeeTopbar onSearchResults={setSearchResults} />

        <div className="p-6 space-y-6">
          {searchResults ? (
            <>
              <h2 className="text-xl font-semibold text-blue-800">Search Results</h2>

              {/* Scrollable result container */}
              <div className="max-h-[80vh] overflow-y-auto pr-2 space-y-4">

                {/* Render tasks with full info */}
                {searchResults.tasks.map((task) => (
                  <div key={task._id} className="bg-white p-5 rounded-lg shadow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h3>
                    <p className="text-gray-600 mb-1"><strong>Description:</strong> {task.description}</p>
                    <p className="text-gray-600 mb-1"><strong>Status:</strong> {task.status}</p>
                    <p className="text-gray-600 mb-1"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
                    <p className="text-gray-600 mb-1"><strong>Assigned Date:</strong> {new Date(task.assignDate).toLocaleDateString()}</p>
                    {task.completedBy && (
                      <p className="text-gray-600"><strong>Completed By:</strong> {task.completedBy}</p>
                    )}
                  </div>
                ))}

                {/* Render projects with full info */}
                {searchResults.projects.map((project) => (
                  <div key={project._id} className="bg-white p-5 rounded-lg shadow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{project.projectTitle}</h3>
                    <p className="text-gray-600 mb-1"><strong>Description:</strong> {project.description}</p>
                    <p className="text-gray-600 mb-1"><strong>Client:</strong> {project.clientName}</p>
                    <p className="text-gray-600 mb-1"><strong>SRF Number:</strong> {project.srfNumber}</p>
                    <p className="text-gray-600 mb-1"><strong>Type:</strong> {project.type}</p>
                    <p className="text-gray-600 mb-1"><strong>Status:</strong> {project.status}</p>
                    <p className="text-gray-600 mb-1"><strong>Cycle Number:</strong> {project.cycleNumber}</p>
                    <p className="text-gray-600 mb-1"><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                    <p className="text-gray-600"><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                  </div>
                ))}

              </div>
            </>
          ) : (
            <DashboardTasksOverview />
          )}
        </div>
      </main>
    </div>
  );
}
