import StudentTable from './components/StudentTable';
import StudentProfile from './components/StudentProfile';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
      <Router>
        <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6">
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<StudentTable />} />
            <Route path="/students/:id" element={<StudentProfile />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
