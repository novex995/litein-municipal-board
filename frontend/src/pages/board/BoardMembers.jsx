import { useState, useEffect } from 'react'
import { Users, AlertCircle } from 'lucide-react'

const BoardMembers = () => {
  const [boardMembers, setBoardMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBoardMembers()
  }, [])

  const fetchBoardMembers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all users from the database (public endpoint - no auth required)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/public`)

      if (!response.ok) {
        throw new Error('Failed to fetch board members')
      }

      const result = await response.json()

      if (result.success && result.data) {
        // Filter board members - only show users with "Board Leadership" department
        const boardLeadership = result.data.filter(user => 
          user.department === 'Board Leadership' && user.is_active !== false
        )
        setBoardMembers(boardLeadership)
      }
    } catch (err) {
      console.error('Error fetching board members:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 mb-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Users className="w-12 h-12 text-white" />
              <h1 className="text-4xl font-bold">BOARD LEADERSHIP</h1>
            </div>
            <p className="text-green-100 text-lg">
              Meet the dedicated leaders of the Litein Municipal Board who guide our vision of building
              a smart, sustainable, and prosperous municipality.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Loading board members...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Error Loading Board Members</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button 
                  onClick={fetchBoardMembers}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && boardMembers.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <Users className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Board Members Found</h3>
              <p className="text-gray-600">
                Board members will appear here once they are added to the system with "Board Leadership" department.
              </p>
            </div>
          )}

          {/* Board Members Grid */}
          {!loading && !error && boardMembers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-64 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center overflow-hidden">
                    {member.avatar_url ? (
                      <img 
                        src={member.avatar_url} 
                        alt={member.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-4xl">
                          {member.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.full_name || 'N/A'}</h3>
                    <p className="text-green-600 font-semibold mb-3">{member.position || 'Board Member'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Board Count */}
          {!loading && !error && boardMembers.length > 0 && (
            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">
                Showing <span className="font-semibold text-green-600">{boardMembers.length}</span> board member{boardMembers.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <p className="text-blue-800">
              <strong>Note:</strong> The Litein Municipal Board is committed to transparent governance
              and serving the interests of all residents. For inquiries, please contact us at{' '}
              <a href="mailto:info@liteinmunicipal.go.ke" className="underline">
                info@liteinmunicipal.go.ke
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardMembers
