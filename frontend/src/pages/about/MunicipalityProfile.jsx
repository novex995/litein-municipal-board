import { Building2, MapPin, Users, Calendar, Award, TrendingUp } from 'lucide-react'

const MunicipalityProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 mb-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Building2 className="w-12 h-12 text-white" />
              <h1 className="text-4xl font-bold">Municipality Profile</h1>
            </div>
            <p className="text-green-100 text-lg">
              Learn about Litein Municipality - our history, demographics, and development journey
            </p>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p className="text-lg leading-relaxed">
                Litein Municipality is a vibrant and growing urban center located in Litein Town, 
                Bureti Sub-County, Kericho County, Kenya. Established to provide efficient municipal 
                services and drive local development, we serve as a hub for economic activity, 
                governance, and community development in the region.
              </p>
              <p className="text-lg leading-relaxed">
                Our municipality is committed to delivering world-class services while preserving our rich 
                cultural heritage and natural environment. Through innovative governance and strategic 
                partnerships, we are building a smart, sustainable, and prosperous municipality.
              </p>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50,000+</h3>
              <p className="text-gray-600">Estimated Population</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <MapPin className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">120 km²</h3>
              <p className="text-gray-600">Total Area</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">2019</h3>
              <p className="text-gray-600">Year Established</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15%</h3>
              <p className="text-gray-600">Annual Growth Rate</p>
            </div>
          </div>

          {/* Geographic Location */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Geographic Location</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Location Details</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>County:</strong> Kericho County</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Region:</strong> Rift Valley</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Altitude:</strong> Approximately 2,000 meters above sea level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span><strong>Climate:</strong> Temperate with moderate rainfall</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessibility</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Well-connected via Kericho-Kisii highway</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Located in Litein Town, Bureti Sub-County</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Access to regional transport networks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Public transport readily available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Economic Profile */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Economic Profile</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Agriculture</h3>
                <p className="text-gray-700">
                  Tea farming, dairy farming, and horticulture are major economic activities
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Commerce</h3>
                <p className="text-gray-700">
                  Growing retail and wholesale trade serving the local and regional markets
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Services</h3>
                <p className="text-gray-700">
                  Healthcare, education, financial services, and hospitality sectors
                </p>
              </div>
            </div>
          </div>

          {/* Municipal Services */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Municipal Services</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Infrastructure</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Road network development and maintenance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Street lighting and public facilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Water and sanitation services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Waste management and recycling</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Services</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Public parks and recreation facilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Market infrastructure and management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Business licensing and permits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Public grievance resolution</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Development Priorities */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Development Priorities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Current Focus Areas</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Smart city infrastructure development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Environmental conservation and sustainability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Youth empowerment and job creation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Healthcare and education improvements</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Strategic Goals (2024-2028)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>100% street lighting coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Enhanced digital service delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Improved revenue collection systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Expanded public participation forums</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MunicipalityProfile
