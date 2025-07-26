'use client';

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  ClipboardList,
  FileText,
  FolderKanban,
  PlusCircle,
  LogOut,
  UserCircle,
  ShieldCheck,
} from "lucide-react";

const menuSections = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        link: "/employee/dashboard",
      },
      {
        name: "Change Password",
        icon: <User size={20} />,
        link: "/employee/profile",
      },
    ],
  },
  {
    title: "Project & Testing",
    items: [
      {
        name: "Projects",
        icon: <FolderKanban size={20} />,
        link: "/employee/project",
      },
      {
        name: "Add Project",
        icon: <PlusCircle size={20} />,
        link: "/employee/add-project",
      },
      {
        name: "Job Register",
        icon: <ClipboardList size={20} />,
        link: "/employee/job-register",
      },
      {
        name: "Report Register",
        icon: <FileText size={20} />,
        link: "/employee/report-register",
      },
    ],
  },
];

export default function EmployeeSidebar() {
  const { data: session } = useSession();
  const employeeName = session?.user?.name;

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      {/* Employee Info */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gray-800 p-2 rounded-full mb-2">
          <UserCircle size={48} />
        </div>
        <p className="font-semibold">{employeeName}</p>
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <ShieldCheck size={14} />
          <span>Employee</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <p className="text-gray-400 uppercase text-xs font-semibold mb-2 px-2">{section.title}</p>
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

      {/* Logout */}
      <a
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition text-red-400 mt-6 cursor-pointer"
      >
        <LogOut size={20} />
        Logout
      </a>
    </aside>
  );
}
