'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";
import { UserCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function InternProfilePage() {
  const { data: session } = useSession();
  const internName = session?.user?.name;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success(data.message || "Password updated!");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      toast.error(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-800 p-2 rounded-full mb-2">
            <UserCircle size={48} />
          </div>
          <p className="font-semibold">{internName}</p>
        </div>
        <nav className="space-y-4">
          <a href="/intern/dashboard" className="block text-sm hover:underline">Dashboard</a>
          <a href="/intern/tasks" className="block text-sm hover:underline">Pending Tasks</a>
        </nav>
      </aside>

      {/* Profile Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Settings</h1>

        <div className="bg-white shadow p-6 rounded-lg max-w-md">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-800 bg-gray-100 px-3 py-2 rounded">{internName}</p>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
          <form className="space-y-4" onSubmit={handlePasswordChange}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded text-gray-800"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
