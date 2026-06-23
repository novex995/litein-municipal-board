import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown, ChevronRight, User, Users, BookOpen, Flag, Home as HomeIcon, FileText, MessageSquare, Download, Briefcase, Mail } from 'lucide-react'
import Chatbot from '../components/Chatbot'

const PublicLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-amber-50">
      {/* Top Government Bar */}
      <div className="bg-primary text-white py-2 overflow-hidden relative">
        <div className="flex items-center">
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap text-sm">
            <span className="font-semibold flex items-center gap-1"><Flag className="w-4 h-4" /> Government of Kenya</span>
            <span>|</span>
            <span>County Government of Kericho</span>
            <span>|</span>
            <span>Litein Municipality Board</span>
            <span>|</span>
            <span>Building a Smart, Sustainable and Prosperous Litein</span>
            <span>|</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 inline" /> Emergency: 999 / 112</span>
            <span>|</span>
            <span>Citizen Services Available Online</span>
            <span>|</span>
            <span>Report Issues 24/7</span>
            <span>|</span>
          </div>
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap text-sm" aria-hidden="true">
            <span className="font-semibold flex items-center gap-1"><Flag className="w-4 h-4" /> Government of Kenya</span>
            <span>|</span>
            <span>County Government of Kericho</span>
            <span>|</span>
            <span>Litein Municipality Board</span>
            <span>|</span>
            <span>Building a Smart, Sustainable and Prosperous Litein</span>
            <span>|</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 inline" /> Emergency: 999 / 112</span>
            <span>|</span>
            <span>Citizen Services Available Online</span>
            <span>|</span>
            <span>Report Issues 24/7</span>
            <span>|</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white'
      }`}>
        <div className="container">
          <div className="flex items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img 
                src="/kericho-county.png"
                alt="Kericho County" 
                className="h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Litein Municipal Board</h1>
                <p className="text-xs text-gray-600">County Government of Kericho</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center gap-3 text-sm ml-8">
              <Link to="/" className="text-gray-800 hover:text-green-600 font-medium transition-colors whitespace-nowrap">Home</Link>
              
              <Link to="/about" className="text-gray-800 hover:text-green-600 font-medium transition-colors whitespace-nowrap">About Us</Link>

              {/* Board Leadership with dropdown */}
              <div className="relative group">
                <button className="text-gray-800 hover:text-green-600 font-medium transition-colors flex items-center gap-1 whitespace-nowrap">
                  Board Leadership <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-gray-100">
                  <Link to="/board/members" className="block px-4 py-3 text-gray-700 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center gap-2">
                    <Users className="w-4 h-4 opacity-70" />
                    <span>Board Members</span>
                  </Link>
                  <Link to="/board/municipal-staff" className="block px-4 py-3 text-gray-700 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center gap-2">
                    <Users className="w-4 h-4 opacity-70" />
                    <span>Municipal Staff</span>
                  </Link>
                </div>
              </div>

              {/* Grievance - single link */}
              <Link to="/grievance" className="text-gray-800 hover:text-green-600 font-medium transition-colors whitespace-nowrap">Grievance</Link>

              {/* Resource Centre */}
              <div className="relative group">
                <button className="text-gray-800 hover:text-green-600 font-medium transition-colors flex items-center gap-1 whitespace-nowrap">
                  Resource Centre <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-gray-100">
                  <Link to="/downloads" className="block px-4 py-3 text-gray-700 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 opacity-70" />
                    <span>Downloads</span>
                  </Link>
                  <Link to="/projects" className="block px-4 py-3 text-gray-700 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 opacity-70" />
                    <span>Projects</span>
                  </Link>
                  <Link to="/media/news" className="block px-4 py-3 text-gray-700 hover:bg-green-600 hover:text-white transition-all duration-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 opacity-70" />
                    <span>News & Events</span>
                  </Link>
                </div>
              </div>

              {/* Contact Us */}
              <Link to="/contact" className="text-gray-800 hover:text-green-600 font-medium transition-colors whitespace-nowrap">Contact Us</Link>
            </div>

            {/* Staff Login Button - Separate, Far Right */}
            <Link to="/staff-login" className="hidden xl:flex ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors items-center gap-2 whitespace-nowrap">
              <User className="w-4 h-4" />
              Staff Login
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-gray-700 ml-auto"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <>
              {/* Overlay */}
              <div 
                className="xl:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Slide-in Menu */}
              <div className="xl:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto">
                {/* Menu Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 relative">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white">
                      <div className="font-semibold">Welcome</div>
                      <div className="text-sm text-white/90">Litein Municipality</div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/staff-login"
                    className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-full font-semibold text-sm hover:bg-yellow-400 transition-colors"
                  >
                    → Log in
                  </Link>
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-800/20 rounded-full -mr-16 -mt-16" />
                </div>

                {/* Menu Items */}
                <div className="py-4">
                  {/* Home */}
                  <Link 
                    to="/" 
                    className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <HomeIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Home</span>
                  </Link>

                  {/* About Us */}
                  <Link 
                    to="/about" 
                    className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="font-medium">About Us</span>
                  </Link>

                  {/* Board Leadership */}
                  <div className="border-t border-gray-100">
                    <Link 
                      to="/board/members" 
                      className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Board Members</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link 
                      to="/board/municipal-staff" 
                      className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Municipal Staff</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>

                  {/* Grievance */}
                  <div className="border-t border-gray-100">
                    <Link 
                      to="/grievance" 
                      className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Grievance</span>
                    </Link>
                  </div>

                  {/* Resource Centre */}
                  <div className="border-t border-gray-100">
                    <Link 
                      to="/downloads" 
                      className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Downloads</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link 
                      to="/projects" 
                      className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Projects</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link 
                      to="/media/news" 
                      className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-green-600" />
                        <span className="font-medium">News & Events</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>

                  {/* Contact Us */}
                  <div className="border-t border-gray-100">
                    <Link 
                      to="/contact" 
                      className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Contact Us</span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Chatbot */}
      <Chatbot />

      {/* Footer */}
      <footer className="bg-[#00b33c] text-white">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4">Litein Municipal Board</h3>
              <p className="text-white/95 text-sm mb-4">
                Building a Smart, Sustainable and Prosperous Litein through innovative governance and citizen-centered services.
              </p>
              <div className="flex gap-3">
                <a 
                  href="https://facebook.com/liteinmunicipal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  title="Follow us on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://twitter.com/liteinmunicipal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  title="Follow us on Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/liteinmunicipal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  title="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/grievance" className="text-white/95 hover:text-white transition-colors">Grievance</Link></li>
                <li><Link to="/projects" className="text-white/95 hover:text-white transition-colors">Projects</Link></li>
                <li><Link to="/downloads" className="text-white/95 hover:text-white transition-colors">Downloads</Link></li>
                <li><Link to="/about" className="text-white/95 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-white/95">
                <li>Litein Town, Bureti Sub-County</li>
                <li>P.O. Box 43 - 20210 </li>
                <li>Email: info@liteinmunicipal.go.ke</li>
                <li>Phone: +254 712 345 678</li>
                <li>Emergency: 999 / 112</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/95">
            <p>&copy; {new Date().getFullYear()} Litein Municipal Board. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
