"use client";

import { useState } from "react";

type UserRecord = {
  id: string;
  email: string;
  created_at: string;
  status?: string;
};

export function UsersTable() {
  const [adminKey, setAdminKey] = useState("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [message, setMessage] = useState("");

  async function loadUsers() {
    const res = await fetch("/api/admin/users/list", {
      headers: { "x-admin-key": adminKey }
    });
    const data = await res.json();
    setUsers(Array.isArray(data?.users) ? data.users : []);
  }

  async function deleteUser(id: string) {
    const res = await fetch("/api/admin/users/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey
      },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    setMessage(data?.message || data?.error || "Done");
    await loadUsers();
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/users/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey
      },
      body: JSON.stringify({ id, status })
    });
    const data = await res.json();
    setMessage(data?.message || data?.error || "Done");
    await loadUsers();
  }

  return (
    <section className="surface-card p-6">
      <h2 className="text-xl font-black">Track and Manage Users</h2>
      <p className="mt-1 text-sm text-slate-600">Set admin key, then view users, suspend, reactivate, or delete.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          placeholder="Admin API key"
          className="w-full rounded-xl bg-slate-100 px-4 py-3"
        />
        <button onClick={() => void loadUsers()} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          Load Users
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-slate-500">
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Created</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-black/5">
                <td className="px-2 py-2">{user.email}</td>
                <td className="px-2 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-2 py-2">{user.status || "active"}</td>
                <td className="px-2 py-2">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateStatus(user.id, "active")} className="rounded-full bg-slate-100 px-3 py-1">Activate</button>
                    <button onClick={() => updateStatus(user.id, "suspended")} className="rounded-full bg-amber-100 px-3 py-1">Suspend</button>
                    <button onClick={() => deleteUser(user.id)} className="rounded-full bg-red-100 px-3 py-1">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
