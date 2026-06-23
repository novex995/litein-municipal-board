import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, Building2 } from 'lucide-react'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Show confirmation dialog
    setShowConfirmation(true)
  }

  const confirmSubmit = async () => {
    setIsSubmitting(true)
    setShowConfirmation(false)

    // Simulate API call (replace with actual backend call later)
    try {
      // TODO: Replace with actual API endpoint
      // await fetch('http://localhost:5000/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      setIsSubmitting(false)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
      alert('Failed to send message. Please try again.')
    }
  }

  const cancelSubmit = () => {
    setShowConfirmation(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Litein Municipal Offices', 'Litein Town, Bureti Sub-County', 'P.O. Box 43 - 20210 LITEIN']
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['Office: +254 712 345 678', 'Emergency: 999 / 112', 'Mon - Fri: 8:00 AM - 5:00 PM']
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['General: info@litein.go.ke', 'Support: support@litein.go.ke', 'Reports: reports@litein.go.ke']
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 8:00 AM - 1:00 PM', 'Sunday & Holidays: Closed']
    },
  ]

  const departments = [
    { name: 'Administration', email: 'admin@litein.go.ke', phone: '+254 712 345 001' },
    { name: 'Finance & Revenue', email: 'finance@litein.go.ke', phone: '+254 712 345 002' },
    { name: 'Planning & Development', email: 'planning@litein.go.ke', phone: '+254 712 345 003' },
    { name: 'Trade & Licensing', email: 'trade@litein.go.ke', phone: '+254 712 345 005' },
    { name: 'Public Health', email: 'health@litein.go.ke', phone: '+254 712 345 006' },
    { name: 'Environment', email: 'environment@litein.go.ke', phone: '+254 712 345 004' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-6">Contact Us</h1>
            <p className="text-base md:text-xl">
              Get in touch with us. We're here to help and answer any questions you may have
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center p-4 md:p-6"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <info.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{info.title}</h3>
                <div className="space-y-1 text-gray-600">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-xs md:text-sm">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={isSubmitting}>
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              {/* Success Message */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3"
                >
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="font-semibold">Thank you for contacting us! We will respond within 24 hours.</p>
                </motion.div>
              )}
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-4 md:space-y-6"
            >
              {/* Google Maps Embed */}
              <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15958.478237985842!2d35.13489!3d-0.62018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182aa7c7f7c7c7c7%3A0x1!2sLitein%2C%20Kenya!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Litein Municipal Board Location"
                ></iframe>
              </div>

              <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Get Directions</h3>
                <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                  Litein Municipality is located in Litein Town along the Kericho-Kisii highway, 
                  in Bureti Sub-County, Kericho County.
                </p>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=Litein,Kenya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline w-full flex items-center justify-center gap-2 py-3"
                >
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  Open in Google Maps
                </a>
              </div>

              <div className="bg-primary text-white rounded-lg p-4 md:p-6 hidden md:block">
                <h3 className="text-xl font-bold mb-3">Emergency Contacts</h3>
                <div className="space-y-2">
                  <p><strong>Police:</strong> 999 / 112</p>
                  <p><strong>Fire Services:</strong> 999</p>
                  <p><strong>Ambulance:</strong> 999 / 112</p>
                  <p><strong>Municipal Emergency:</strong> +254 712 345 999</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Department Contacts</h2>
            <p className="section-subtitle">Reach specific departments directly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold">{dept.name}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {dept.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {dept.phone}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Confirm Submission</h3>
              <p className="text-gray-600">
                Are you sure you want to send this message to Litein Municipal Board?
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Subject:</strong> {formData.subject}</p>
              <p><strong>Message:</strong> {formData.message.substring(0, 100)}{formData.message.length > 100 ? '...' : ''}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelSubmit}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Contact
