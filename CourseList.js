// src/components/CourseList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import WeeklySummaryChart from './WeeklySummaryChart';

const API_URL = 'http://localhost:8082/api/courses';

export default function CourseList() {
  const [plans, setPlans] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    priorityLevel: '',
    targetDate: ''
  });
  const [includeArchived, setIncludeArchived] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch plans with the new single date filter
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const params = {
        includeArchived,
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.priorityLevel && { priorityLevel: filters.priorityLevel }),
        ...(filters.targetDate && { targetDate: filters.targetDate }),
      };
      const res = await axios.get(API_URL, { params });
      setPlans(res.data.content ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // initial load & when includeArchived toggles
  useEffect(() => {
    fetchPlans();
  }, [includeArchived]);

  // Progress bar calc
  const total = plans.length;
  const completedCount = plans.filter(p => p.completed).length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  // Handlers
  const handleFilterChange = e =>
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  const clearFilters = () => {
    setFilters({ subject: '', priorityLevel: '', targetDate: '' });
    fetchPlans();
  };
  const toggleComplete = async (id, current) => {
    await axios.patch(`${API_URL}/${id}/complete`, null, {
      params: { completed: !current }
    });
    fetchPlans();
  };
  const archivePlan = async id => {
    if (!window.confirm('Archive this plan?')) return;
    await axios.patch(`${API_URL}/${id}/archive`);
    fetchPlans();
  };
  const deletePlan = async id => {
    if (!window.confirm('Delete permanently?')) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchPlans();
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 space-y-6">
      <WeeklySummaryChart plans={plans} />
      {/* Progress */}
      <div>
        <p className="text-gray-700 text-sm">
          Progress: <strong>{completedCount}</strong> of <strong>{total}</strong> ({percent}%)
        </p>
        <div className="w-full bg-gray-200 h-2 rounded mt-1">
          <div className="bg-blue-500 h-2 rounded" style={{ width: `${percent}%` }}/>
        </div>
      </div>

      {/* Filters + Archived Toggle */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          <input
            name="subject"
            placeholder="Subject"
            value={filters.subject}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 min-w-[120px]"
          />
          <select
            name="priorityLevel"
            value={filters.priorityLevel}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2 min-w-[120px]"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            name="targetDate"
            value={filters.targetDate}
            onChange={handleFilterChange}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPlans}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Apply'}
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Clear
          </button>
          <label className="inline-flex items-center ml-2">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={e => setIncludeArchived(e.target.checked)}
              className="form-checkbox h-5 w-5 text-purple-600"
            />
            <span className="ml-2 text-gray-700 text-sm">Show Archived</span>
          </label>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Manage Learning Plans
        </h2>
        <Link
          to="/add"
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded shadow"
        >
          + Add Plan
        </Link>
      </div>

      {/* Table (scrolls on mobile) */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Title','Subject','Target Date','Priority','Status','Archived','Actions'].map(h => (
                <th key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map(plan => (
              <tr key={plan.id}
                  className={`hover:bg-gray-50 ${
                    plan.archived ? 'text-gray-400 italic bg-gray-100' : ''
                  }`}>
                <td className="px-6 py-4 whitespace-nowrap">{plan.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plan.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(plan.targetDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.priorityLevel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.completed
                    ? <span className="text-green-600">Done</span>
                    : <span className="text-yellow-600">In Progress</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plan.archived && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      Archived
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-1 text-sm">
                  <Link to={`/courses/${plan.id}`} className="text-blue-600 hover:underline">View</Link>
                  <Link to={`/edit/${plan.id}`} className="text-yellow-600 hover:underline">Edit</Link>
                  <button onClick={() => toggleComplete(plan.id, plan.completed)}
                          className="text-green-600 hover:underline">
                    {plan.completed ? 'Unmark' : 'Complete'}
                  </button>
                  {!plan.archived && (
                    <button onClick={() => archivePlan(plan.id)}
                            className="text-purple-600 hover:underline">
                      Archive
                    </button>
                  )}
                  <button onClick={() => deletePlan(plan.id)}
                          className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && plans.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No plans found. Click “Add Plan” to create one.
          </div>
        )}
      </div>
    </div>
  );
}
