import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CourseList from './pages/CourseList';
import CourseForm from './pages/CourseForm';
import CourseGallery from './pages/CourseGallery';
import CourseDetail from './pages/CourseDetail';
function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        {/* Navigation Bar temperary remove this after integration */}
        <nav className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Course Catalog</h1>
          <Link to="/add" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add Course
          </Link>
          <Link to="/courses" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            View Courses
          </Link>
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            View Courses admin
          </Link>
          
        </nav>

        <Routes>
        <Route path="/courses" element={<CourseGallery />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/" element={<CourseList />} />
          <Route path="/add" element={<CourseForm />} />
          <Route path="/edit/:id" element={<CourseForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
