import { motion } from 'framer-motion'
import { HardHat, CheckCircle, Clock, Calendar, MapPin, DollarSign, ImageIcon, Users, TrendingUp, Eye, X, ChevronRight, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
    planning: 0,
    totalBudget: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
    fetchStats()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects?limit=100`)

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const result = await response.json()

      if (result.success && result.data) {
        setProjects(result.data)
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/stats`)

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setStats({
            total: result.data.total || 0,
            ongoing: result.data.ongoing || 0,
            completed: result.data.completed || 0,
            planning: result.data.planning || 0,
            totalBudget: result.data.totalBudget || 0
          })
        }
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const formatBudget = (budget) => {
    if (!budget) return 'TBD'
    const amount = parseFloat(budget)
    if (amount >= 1000000000) return `KES ${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `KES ${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `KES ${(amount / 1000).toFixed(1)}K`
    return `KES ${amount}`
  }

  const getStatusBadge = (status) => {
    const styles = {
      ongoing: 'bg-blue-500 text-white',
      completed: 'bg-green-500 text-white',
      planning: 'bg-yellow-500 text-white'
    }
    const labels = {
      ongoing: 'Ongoing',
      completed: 'Completed',
      planning: 'Planning'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${styles[status] || styles.planning}`}>
        {labels[status] || 'Unknown'}
      </span>
    )
  }

  const statsDisplay = [
    { icon: HardHat, label: 'Active Projects', value: stats.ongoing || 0, color: 'text-blue-600' },
    { icon: CheckCircle, label: 'Completed', value: stats.completed || 0, color: 'text-green-600' },
    { icon: Clock, label: 'In Planning', value: stats.total - stats.ongoing - stats.completed || 0, color: 'text-yellow-600' },
    { icon: DollarSign, label: 'Total Investment', value: formatBudget(stats.totalBudget), color: 'text-purple-600' },
  ]

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === filterStatus)

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <HardHat className="w-4 h-4" />
              <span className="text-sm font-semibold">Development & Infrastructure</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
            <p className="text-lg md:text-xl text-green-100 leading-relaxed">
              Transforming Litein through strategic infrastructure and development initiatives that improve the quality of life for all residents
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-lg animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsDisplay.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 bg-white border-y">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center">
            {['all', 'ongoing', 'completed', 'planning'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                  filterStatus === status
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Projects' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8">
        <div className="container">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Loading projects...</span>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Error Loading Projects</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && filteredProjects.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <HardHat className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
              <p className="text-gray-600">
                {filterStatus === 'all' 
                  ? 'No projects have been added yet. Check back later for updates.'
                  : `No ${filterStatus} projects found. Try a different filter.`}
              </p>
            </div>
          )}

          {!loading && !error && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Compact Image */}
                  <div className="relative h-36 bg-gradient-to-br from-gray-200 to-gray-300">
                    {project.project_images && project.project_images[0] ? (
                      <div
                        className="absolute inset-0 bg-gray-300 hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${project.project_images[0].image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-700/20 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-white/50" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>

                  {/* Compact Content */}
                  <div className="p-4">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                      {project.departments?.name || 'Infrastructure'}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1 mb-2 leading-tight">{project.name}</h3>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{project.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-gray-700">Progress</span>
                        <span className="font-bold text-green-600">{project.completion_percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.completion_percentage || 0}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          viewport={{ once: true }}
                          className="bg-green-600 h-1.5 rounded-full"
                        ></motion.div>
                      </div>
                    </div>

                    {/* Compact Info */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-gray-400" />
                        <span className="font-semibold">{formatBudget(project.budget)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{project.end_date ? new Date(project.end_date).getFullYear() : 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{project.location || 'Litein'}</span>
                      </div>
                    </div>

                    {/* Contractor and See More */}
                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                      <div className="flex items-center gap-1 text-gray-600 truncate mr-2">
                        <HardHat className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{project.contractor || 'TBD'}</span>
                      </div>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 flex-shrink-0"
                      >
                        See more
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div>
        </div>
        <div className="container text-center relative">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-300" />
          <h2 className="text-3xl font-bold mb-4">Have a Project Proposal?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-green-100 leading-relaxed">
            We welcome proposals and partnerships for development projects that benefit our community and align with our vision for Litein
          </p>
          <button className="bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition-colors shadow-xl hover:shadow-2xl">
            Submit Proposal
          </button>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 p-1.5 rounded-full transition-colors z-10 shadow-xl"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl my-4 max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header Section */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-4 rounded-t-xl sticky top-0 z-10">
              <div className="mb-2">
                {getStatusBadge(selectedProject.status)}
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-1">{selectedProject.name}</h2>
              <p className="text-green-100 text-sm line-clamp-2">{selectedProject.description}</p>
            </div>

            {/* Content Section */}
            <div className="p-4">
              {/* Project Images */}
              {selectedProject.project_images && selectedProject.project_images.length > 0 ? (
                <div className="mb-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    Project Images ({selectedProject.project_images.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject.project_images.slice(0, 6).map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={img.image_url}
                          alt={img.caption || `Project image ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  {selectedProject.project_images.length > 6 && (
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Showing 6 of {selectedProject.project_images.length} images
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-4 bg-gray-100 rounded-lg p-4 text-center">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No images available</p>
                </div>
              )}

              {/* Project Details Grid */}
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-gray-600">Budget</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{formatBudget(selectedProject.budget)}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-gray-600">Completion</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedProject.completion_percentage || 0}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${selectedProject.completion_percentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-600">Location</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedProject.location || 'Litein Town'}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-semibold text-gray-600">Timeline</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Start:</span> {selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString() : 'TBD'}
                  </p>
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">End:</span> {selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString() : 'TBD'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <HardHat className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-semibold text-gray-600">Contractor</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedProject.contractor || 'To Be Determined'}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-gray-600">Funding Source</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedProject.funding_source || 'Municipal Budget'}</p>
                </div>
              </div>

              {/* Department Info */}
              {selectedProject.departments && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-0.5">Managed by</p>
                  <p className="text-sm font-bold text-green-700">{selectedProject.departments.name}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 rounded-b-xl border-t sticky bottom-0">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
