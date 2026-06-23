import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import ReportIssue from './pages/ReportIssue'
import Grievance from './pages/Grievance'
import StaffLogin from './pages/StaffLogin'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Emergency from './pages/Emergency'
import Downloads from './pages/Downloads'

// Board Leadership Pages
import BoardMembers from './pages/board/BoardMembers'
import MunicipalStaff from './pages/board/MunicipalStaff'

// About Pages
import VisionMission from './pages/about/VisionMission'
import MunicipalityProfile from './pages/about/MunicipalityProfile'

// Media Centre Pages
import NewsUpdates from './pages/media/News'
import NewsDetail from './pages/NewsDetail'

// Dashboards
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'
import ManagerDashboard from './pages/dashboards/ManagerDashboard'
import DepartmentHeadDashboard from './pages/dashboards/DepartmentHeadDashboard'
import StaffDashboard from './pages/dashboards/StaffDashboard'
import FinanceDashboard from './pages/dashboards/FinanceDashboard'
import LicensesDashboard from './pages/dashboards/LicensesDashboard'
import GrievancesDashboard from './pages/dashboards/GrievancesDashboard'
import ICTDashboard from './pages/dashboards/ICTDashboard'
import MediaDashboard from './pages/dashboards/MediaDashboard'
import CitizenServiceDashboard from './pages/dashboards/CitizenServiceDashboard'

const queryClient = new QueryClient()

// Placeholder component for routes without pages yet
const ComingSoon = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
      <p className="text-gray-600">This page is under development.</p>
    </div>
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Main Public Pages */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/about/vision-mission" element={<PublicLayout><VisionMission /></PublicLayout>} />
            <Route path="/about/profile" element={<PublicLayout><MunicipalityProfile /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/grievance" element={<PublicLayout><Grievance /></PublicLayout>} />

            {/* Board Leadership */}
            <Route path="/board/members" element={<PublicLayout><BoardMembers /></PublicLayout>} />
            <Route path="/board/municipal-staff" element={<PublicLayout><MunicipalStaff /></PublicLayout>} />

            {/* Resource Centre */}
            <Route path="/downloads" element={<PublicLayout><Downloads /></PublicLayout>} />
            <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
            <Route path="/media/news" element={<PublicLayout><NewsUpdates /></PublicLayout>} />
            <Route path="/media/news/:slug" element={<PublicLayout><NewsDetail /></PublicLayout>} />

            {/* Other Pages */}
            <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/report" element={<PublicLayout><ReportIssue /></PublicLayout>} />
            <Route path="/emergency" element={<PublicLayout><Emergency /></PublicLayout>} />

            {/* Authentication */}
            <Route path="/staff-login" element={<PublicLayout><StaffLogin /></PublicLayout>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Dashboards */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/department-head/dashboard" element={<DepartmentHeadDashboard />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/finance/dashboard" element={<FinanceDashboard />} />
            <Route path="/licenses/dashboard" element={<LicensesDashboard />} />
            <Route path="/grievances/dashboard" element={<GrievancesDashboard />} />
            <Route path="/ict/dashboard" element={<ICTDashboard />} />
            <Route path="/media/dashboard" element={<MediaDashboard />} />
            <Route path="/citizen-service/dashboard" element={<CitizenServiceDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
