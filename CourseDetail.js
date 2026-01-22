import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:8082/api/courses';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)
      .then(res => setPlan(res.data))
      .catch(console.error);
  }, [id]);

  if (!plan) {
    return (
      <div className="py-20 text-center text-gray-500">Loading…</div>
    );
  }

  const priorityClasses = level => {
    if (level === 'High') return 'bg-red-100 text-red-800';
    if (level === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <svg
          className="h-5 w-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      {/* Hero */}
      <div className="bg-indigo-600 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-white">
            {plan.title}
          </h1>
          <p className="mt-4 text-indigo-200">{plan.summary}</p>
        </div>
      </div>

      {/* Meta & Materials */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-semibold text-gray-700 mb-2">
              Subject
            </h2>
            <span className="text-gray-800">{plan.subject}</span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-semibold text-gray-700 mb-2">
              Target Date
            </h2>
            <span className="text-gray-800">
              {new Date(plan.targetDate).toLocaleDateString()}
            </span>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-semibold text-gray-700 mb-2">
              Priority
            </h2>
            <span
              className={`inline-block px-3 py-1 rounded-full ${priorityClasses(
                plan.priorityLevel
              )}`}
            >
              {plan.priorityLevel}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="md:col-span-2 space-y-6">
          {/* Completed status */}
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Status:
            </h2>
            {plan.completed ? (
              <span className="text-green-600 font-semibold">
                Completed
              </span>
            ) : (
              <span className="text-yellow-600 font-semibold">
                In Progress
              </span>
            )}
          </div>

          {/* Materials */}
          {plan.materials?.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Materials
              </h2>
              <ul className="list-disc list-inside text-blue-600 space-y-1">
                {plan.materials.map((url, idx) => (
                  <li key={idx}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Content Outline */}
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Content Outline
        </h2>
        {plan.content.map((section, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Section {idx + 1}
            </h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {section}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
