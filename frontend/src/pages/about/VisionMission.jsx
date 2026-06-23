import { Target, Eye, Heart } from 'lucide-react'

const VisionMission = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-md p-8 mb-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Target className="w-12 h-12 text-white" />
              <h1 className="text-4xl font-bold">Our Vision & Mission</h1>
            </div>
            <p className="text-green-100 text-lg">
              Guiding principles that drive Litein Municipality towards excellence and sustainable development
            </p>
          </div>

          {/* Vision Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                <p className="text-gray-600">What we aspire to achieve</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600">
              <p className="text-xl text-gray-800 leading-relaxed">
                "A model municipality delivering world-class services, sustainable development, and improved quality of life for all residents through innovative governance and active citizen participation."
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                <p className="text-gray-600">How we will achieve our vision</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600">
              <p className="text-xl text-gray-800 leading-relaxed mb-6">
                To provide efficient, transparent, and accountable municipal services through:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-lg">Strategic infrastructure development and maintenance</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-lg">Sound environmental management and conservation</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-lg">Promotion of economic growth and job creation</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-lg">Inclusive community participation and engagement</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-lg">Technology-driven service delivery and innovation</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
                <p className="text-gray-600">Principles that guide our work</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-700">Maintaining honesty and strong moral principles in all our operations</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-700">Open and accountable governance with clear communication</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-700">Striving for the highest standards in service delivery</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border-l-4 border-yellow-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-700">Embracing new ideas and technology for better solutions</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Inclusivity</h3>
                <p className="text-gray-700">Ensuring equal opportunities and participation for all</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border-l-4 border-indigo-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainability</h3>
                <p className="text-gray-700">Protecting our environment for future generations</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Join Us in Building a Better Litein</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Together, through shared values and collective action, we can transform Litein into a model municipality that serves all residents with excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/grievance" 
                className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
              >
                Report an Issue
              </a>
              <a 
                href="/contact" 
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-green-600 transition-colors font-semibold"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisionMission
