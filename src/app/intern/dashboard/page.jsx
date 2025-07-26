'use client';

import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  UserCircle,
  ShieldCheck,
  User,
} from "lucide-react";

const internMenu = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        link: "/intern/dashboard",
      },
      {
        name: "Change Password",
        icon: <User size={20} />,
        link: "/intern/profile",
      },
    ],
  },
  {
    title: "Tasks",
    items: [
      {
        name: "Pending Tasks",
        icon: <ListChecks size={20} />,
        link: "/intern/tasks",
      },
    ],
  },
];

export default function InternDashboard() {
  const { data: session } = useSession();
  const internName = session?.user?.name;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-800 p-2 rounded-full mb-2">
            <UserCircle size={48} />
          </div>
          <p className="font-semibold">{internName}</p>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <ShieldCheck size={14} />
            <span>Intern</span>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto">
          {internMenu.map((section, idx) => (
            <div key={idx}>
              <p className="text-gray-400 uppercase text-xs font-semibold mb-2 px-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    href={item.link}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition text-red-400 mt-6"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Dashboard Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Intern Dashboard</h1>
        <p className="text-gray-600">Welcome, {internName || 'Intern'}! Here's your overview.</p>

        {/* Add any stats or dashboard widgets here */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Tasks</h2>
            <p className="text-gray-500">You can view and complete pending tasks from the sidebar.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
