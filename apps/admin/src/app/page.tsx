"use client";

import React from "react";

type StatCard = { label: string; value: string; change: string; up: boolean };

const stats: StatCard[] = [
  { label: "Total Verifications", value: "1,247", change: "+12%", up: true },
  { label: "Active Workers", value: "38", change: "+3", up: true },
  { label: "Pending Reviews", value: "12", change: "-4", up: false },
  { label: "Success Rate", value: "94.2%", change: "+1.1%", up: true },
];

const recentVerifications = [
  { id: "V-4821", name: "Thabo Molefe", type: "ID Document", status: "approved", time: "2 min ago" },
  { id: "V-4820", name: "Sarah Nkosi", type: "Proof of Address", status: "pending", time: "8 min ago" },
  { id: "V-4819", name: "James van der Merwe", type: "ID Document", status: "approved", time: "15 min ago" },
  { id: "V-4818", name: "Lerato Moloi", type: "Bank Statement", status: "rejected", time: "22 min ago" },
  { id: "V-4817", name: "Pieter Coetzee", type: "ID Document", status: "approved", time: "30 min ago" },
];

const workerHealth = [
  { name: "identity-worker", status: "healthy", uptime: "99.97%", lastCheck: "just now" },
  { name: "document-scanner", status: "healthy", uptime: "99.82%", lastCheck: "2 min ago" },
  { name: "notification-service", status: "degraded", uptime: "97.15%", lastCheck: "5 min ago" },
  { name: "audit-logger", status: "healthy", uptime: "99.99%", lastCheck: "1 min ago" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-8">J-Bay Community Hub — verification overview</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow p-6">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className={`text-sm mt-2 ${s.up ? "text-green-600" : "text-red-600"}`}>
                {s.change} from last month
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Verifications */}
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Verifications</h2>
            <ul className="divide-y divide-gray-100">
              {recentVerifications.map((v) => (
                <li key={v.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{v.name}</p>
                    <p className="text-sm text-gray-500">{v.id} · {v.type}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        v.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : v.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {v.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{v.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Worker Health */}
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Worker Health</h2>
            <ul className="divide-y divide-gray-100">
              {workerHealth.map((w) => (
                <li key={w.name} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{w.name}</p>
                    <p className="text-sm text-gray-500">Uptime: {w.uptime}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        w.status === "healthy"
                          ? "bg-green-500"
                          : w.status === "degraded"
                          ? "bg-yellow-400"
                          : "bg-red-500"
                      }`}
                    />
                    <p className="text-xs text-gray-400 mt-1">{w.lastCheck}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
