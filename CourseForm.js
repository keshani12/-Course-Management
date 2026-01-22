import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:8082/api/courses';

const CATEGORY_OPTIONS = [
  'Programming',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Mobile Development'
];

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

export default function CourseForm() {
  const [course, setCourse] = useState({
    title: '',
    summary: '',
    subject: '',
    targetDate: '',
    priorityLevel: '',
    category: '',
    level: '',
    duration: '',
    content: [''],
    materials: [''],
    completed: false
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`${API_URL}/${id}`)
        .then(res => {
          const data = res.data;
          setCourse({
            title: data.title || '',
            summary: data.summary || '',
            subject: data.subject || '',
            targetDate: data.targetDate || '',
            priorityLevel: data.priorityLevel || '',
            category: data.category || '',
            level: data.level || '',
            duration: data.duration || '',
            content: data.content?.length ? data.content : [''],
            materials: data.materials?.length ? data.materials : [''],
            completed: data.completed || false
          });
        })
        .catch(() => setApiError('Failed to load plan.'));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, idx, val) => {
    setCourse(prev => {
      const arr = [...prev[field]];
      arr[idx] = val;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayField = field =>
    setCourse(prev => ({ ...prev, [field]: [...prev[field], ''] }));

  const removeArrayField = (field, idx) =>
    setCourse(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx)
    }));

  const validate = () => {
    const errs = {};
    if (!course.title.trim()) errs.title = 'Title is required.';
    if (!course.summary.trim()) errs.summary = 'Description is required.';
    if (!course.subject.trim()) errs.subject = 'Subject is required.';
    if (!course.targetDate) errs.targetDate = 'Target date is required.';
    if (!course.priorityLevel) errs.priorityLevel = 'Select priority.';
    if (!course.category) errs.category = 'Select a category.';
    if (!course.level) errs.level = 'Select a level.';
    if (!course.duration.trim()) errs.duration = 'Duration is required.';
    if (course.content.some(c => !c.trim()))
      errs.content = 'All content sections must be filled.';
    if (course.materials.some(m => !m.trim()))
      errs.materials = 'All material links must be filled.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`${API_URL}/${id}`, course);
      } else {
        await axios.post(API_URL, course);
      }
      navigate('/');
    } catch {
      setApiError('Server error – please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-xl rounded-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Learning Plan' : 'Add New Learning Plan'}
      </h2>

      {apiError && (
        <div className="bg-red-100 text-red-800 p-3 mb-6 rounded">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            name="title"
            value={course.title}
            onChange={handleChange}
            className={`w-full border rounded px-4 py-2 focus:outline-none ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="summary"
            value={course.summary}
            onChange={handleChange}
            rows={3}
            className={`w-full border rounded px-4 py-2 focus:outline-none ${
              errors.summary ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.summary && (
            <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
          )}
        </div>

        {/* Subject & Target Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Subject / Topic
            </label>
            <input
              name="subject"
              value={course.subject}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Target Date
            </label>
            <input
              type="date"
              name="targetDate"
              value={course.targetDate}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                errors.targetDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.targetDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.targetDate}
              </p>
            )}
          </div>
        </div>

        {/* Priority, Category, Level, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Priority Level
            </label>
            <select
              name="priorityLevel"
              value={course.priorityLevel}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                errors.priorityLevel ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select --</option>
              {PRIORITY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.priorityLevel && (
              <p className="text-red-500 text-sm mt-1">
                {errors.priorityLevel}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={course.category}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select --</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              name="level"
              value={course.level}
              onChange={handleChange}
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                errors.level ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select --</option>
              {LEVEL_OPTIONS.map(lvl => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            {errors.level && (
              <p className="text-red-500 text-sm mt-1">{errors.level}</p>
            )}
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              name="duration"
              value={course.duration}
              onChange={handleChange}
              placeholder="e.g. 4 weeks"
              className={`w-full border rounded px-4 py-2 focus:outline-none ${
                errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration}
              </p>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div>
          <label className="block font-medium text-gray-700 mb-3">
            Content Sections
          </label>
          {course.content.map((c, idx) => (
            <div key={idx} className="flex items-start mb-2 space-x-2">
              <textarea
                value={c}
                onChange={e =>
                  handleArrayChange('content', idx, e.target.value)
                }
                placeholder={`Section ${idx + 1}`}
                className={`flex-1 border rounded px-4 py-2 focus:outline-none ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {course.content.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('content', idx)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('content')}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add Section
          </button>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Materials (URLs) */}
        <div>
          <label className="block font-medium text-gray-700 mb-3">
            Related Materials (links)
          </label>
          {course.materials.map((m, idx) => (
            <div key={idx} className="flex items-center mb-2 space-x-2">
              <input
                value={m}
                onChange={e =>
                  handleArrayChange('materials', idx, e.target.value)
                }
                placeholder="https://example.com/material.pdf"
                className={`flex-1 border rounded px-4 py-2 focus:outline-none ${
                  errors.materials ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {course.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('materials', idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('materials')}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add Material
          </button>
          {errors.materials && (
            <p className="text-red-500 text-sm mt-1">{errors.materials}</p>
          )}
        </div>

        {/* Completed Toggle (edit only) */}
        {isEdit && (
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="completed"
                checked={course.completed}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              <span className="ml-2 text-gray-700">Mark as Completed</span>
            </label>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {isEdit ? 'Update Plan' : 'Create Plan'}
        </button>
      </form>
    </div>
  );
}
