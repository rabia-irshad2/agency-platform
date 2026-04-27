import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home      from './pages/Home';
import About     from './pages/About';
import Services  from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog      from './pages/Blog';
import BlogPost  from './pages/BlogPost';
import Contact   from './pages/Contact';
import Booking   from './pages/Booking';

// Admin Pages
import AdminLogin       from './pages/admin/Login';
import Dashboard        from './pages/admin/Dashboard';
import ManageServices   from './pages/admin/ManageServices';
import ManagePortfolio  from './pages/admin/ManagePortfolio';
import ManageBlog       from './pages/admin/ManageBlog';
import ManageInquiries  from './pages/admin/ManageInquiries';
import ManageMeetings   from './pages/admin/ManageMeetings';

const isAdminPath = (path) => path.startsWith('/admin');

function Layout() {
  const location = useLocation();
  const admin = isAdminPath(location.pathname);

  return (
    <>
      {!admin && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/blog"      element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/booking"   element={<Booking />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/services"  element={<ProtectedRoute><ManageServices /></ProtectedRoute>} />
        <Route path="/admin/portfolio" element={<ProtectedRoute><ManagePortfolio /></ProtectedRoute>} />
        <Route path="/admin/blog"      element={<ProtectedRoute><ManageBlog /></ProtectedRoute>} />
        <Route path="/admin/inquiries" element={<ProtectedRoute><ManageInquiries /></ProtectedRoute>} />
        <Route path="/admin/meetings"  element={<ProtectedRoute><ManageMeetings /></ProtectedRoute>} />
      </Routes>
      {!admin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
            success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
          }}
        />
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}