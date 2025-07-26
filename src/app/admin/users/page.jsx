'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Search } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users?search=${search}`);
      const json = await res.json();
      setUsers(json.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const onSubmit = async (data) => {
    ;
    try {
      console.log(data)
      const endpoint = editingUser ? `/api/users/${editingUser._id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status === 409) {
        alert('User already exists');
        return;
      }

      if (res.ok) {
        toast.success(editingUser ? 'User updated' : 'User created');
        reset();
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(`Failed to ${editingUser ? 'update' : 'create'} user`);
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted');
        fetchUsers();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setValue('name', user.name);
    setValue('userId', user.userId);
    setValue('role', user.role);
    setValue('password', '');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-800">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8">User Management</h1>

      <div className="mb-8 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search users by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchUsers}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
        >
          <Search size={18} /> Search
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
          <input {...register('name', { required: true })} className="p-3 border rounded-lg text-gray-800" placeholder="Name" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">User ID</label>
          <input {...register('userId', { required: true })} className="p-3 border rounded-lg text-gray-800" placeholder="User ID" />
        </div>

        <div className="flex flex-col relative">
          <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="Enter new password"
            className="p-3 border rounded-lg text-gray-800 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Role</label>
          <select {...register('role', { required: true })} className="p-3 border rounded-lg text-gray-800">
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="intern">Intern</option>
          </select>
        </div>

        <button
          type="submit"
          className="col-span-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-xl shadow-lg mt-2"
        >
          {editingUser ? 'Update User' : 'Add User'}
        </button>
      </form>

      <div className="grid gap-4">
        {users.map(user => (
          <div key={user._id} className="flex justify-between items-center bg-white p-5 rounded-xl shadow hover:shadow-lg">
            <div>
              <p className="text-gray-800 font-medium"><strong>Name:</strong> {user.name}</p>
              <p className="text-gray-800"><strong>ID:</strong> {user.userId}</p>
              <p className="text-gray-800"><strong>Role:</strong> {user.role}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(user)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow">Edit</button>
              <button onClick={() => handleDelete(user._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}