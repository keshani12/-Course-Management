// src/components/CourseGallery.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8082/api/courses';
const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

export default function CourseGallery() {
  const [plans, setPlans] = useState([]);
  const [filters, setFilters] = useState({ title: '', priorityLevel: '' });
  const [loading, setLoading] = useState(false);

  // Fetch plans whenever title or priorityLevel changes
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const params = {
          ...(filters.title && { title: filters.title }),
          ...(filters.priorityLevel && { priorityLevel: filters.priorityLevel }),
        };
        const res = await axios.get(API_URL, { params });
        setPlans(res.data.content ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [filters.title, filters.priorityLevel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ title: '', priorityLevel: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900">All Learning Plans</h2>

      {/* Live Search & Priority Filter */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          name="title"
          placeholder="Search by Title…"
          value={filters.title}
          onChange={handleChange}
          className="border rounded px-3 py-2 flex-1"
        />
        <select
          name="priorityLevel"
          value={filters.priorityLevel}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={clearFilters}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <p className="text-center text-gray-600">Loading…</p>
      ) : plans.length === 0 ? (
        <p className="text-center text-gray-500">No plans found.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {plan.title}
              </h3>
              <p className="text-gray-600 flex-1 mb-4">
                {plan.summary?.length > 100
                  ? plan.summary.slice(0, 100) + '…'
                  : plan.summary}
              </p>
              <div className="mb-4 space-x-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {plan.subject}
                </span>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {plan.priorityLevel}
                </span>
              </div>
              <Link
                to={`/courses/${plan.id}`}
                className="mt-auto block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
