import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<PlaceholderPage title="Login" />} />
        <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
        <Route path="/students" element={<PlaceholderPage title="Students" />} />
        <Route path="/students/new" element={<PlaceholderPage title="Add Student" />} />
        <Route path="*" element={<PlaceholderPage title="Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
