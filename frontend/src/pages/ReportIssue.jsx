import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Upload, MapPin, Camera, AlertCircle, CheckCircle } from 'lucide-react'
import { complaintsApi } from '../services/api'
import 'leaflet/dist/leaflet.css'

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    coordinates: { lat: -0.5849, lng: 35.2367 }, // Litein coordinates
    images: [],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    referenceNumber: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const issueCategories = [
    { value: 'road_damage', label: 'Road Damage', icon: '🚗' },
    { value: 'garbage', label: 'Garbage Collection', icon: '🗑️' },
    { value: 'drainage', label: 'Blocked Drainage', icon: '🌊' },
    { value: 'water_leak', label: 'Water Leaks', icon: '💧' },
    { value: 'streetlight', label: 'Broken Streetlights', icon: '💡' },
    { value: 'illegal_dumping', label: 'Illegal Dumping', icon: '⚠️' },
    { value: 'other', label: 'Other', icon: '📝' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await complaintsApi.create({
        category: formData.category,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: formData.coordinates.lat,
        longitude: formData.coordinates.lng,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        images: [] // Handle image uploads separately if needed
      })
      
      setFormData(prev => ({ ...prev, referenceNumber: response.data.data.reference_number }))
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting complaint:', error)
      alert('Failed to submit complaint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData({ ...formData, images: [...formData.images, ...files] })
  }

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData({
          ...formData,
          coordinates: { lat: e.latlng.lat, lng: e.latlng.lng }
        })
      },
    })

    return formData.coordinates ? (
      <Marker position={[formData.coordinates.lat, formData.coordinates.lng]} />
    ) : null
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="container max-w-2xl">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Issue Reported Successfully!</h2>
            <p className="text-lg text-gray-600 mb-2">Your reference number is:</p>
            <p className="text-2xl font-bold text-primary mb-6">{formData.referenceNumber}</p>
            <p className="text-gray-600 mb-8">
              We've received your report and our team will review it shortly. You'll receive updates via email and SMS.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-primary"
              >
                Report Another Issue
              </button>
              <button
                onClick={() => window.location.href = '/track-complaints'}
                className="btn btn-outline"
              >
                Track Your Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
            <p className="text-gray-600">Help us improve Litein by reporting issues in your area</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Issue Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {issueCategories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.category === cat.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="text-sm font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Issue Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Pothole on Main Street"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information about the issue..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Near Litein Market"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Map */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pin Location on Map (Click to mark)
              </label>
              <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                  center={[formData.coordinates.lat, formData.coordinates.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Coordinates: {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload photos
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 5MB each
                  </p>
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Upload ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+254 712 345 678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>You'll receive a reference number immediately</li>
                  <li>Our team will review your report within 24 hours</li>
                  <li>You'll get SMS and email updates on progress</li>
                  <li>Track your report anytime using the reference number</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !formData.category || !formData.title}
                className="btn btn-primary flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportIssue
