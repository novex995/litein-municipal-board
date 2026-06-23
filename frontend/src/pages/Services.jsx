import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Briefcase, Building2, ShoppingBasket, Home as HomeIcon,
  FileText, DollarSign, UserCheck, Truck, Zap, Droplet,
  Trash2, Leaf, Users, BookOpen, Heart, Shield
} from 'lucide-react'

const Services = () => {
  const serviceCategories = [
    {
      category: 'Business & Trade',
      icon: Briefcase,
      color: 'bg-blue-500',
      services: [
        { name: 'Business Permits & Licenses', desc: 'Apply for new or renew existing business licenses', link: '/services/business' },
        { name: 'Trade License', desc: 'Licensing for trading activities', link: '/services/trade' },
        { name: 'Market Stall Allocation', desc: 'Application for market stalls and trading spaces', link: '/services/market' },
      ]
    },
    {
      category: 'Building & Construction',
      icon: Building2,
      color: 'bg-orange-500',
      services: [
        { name: 'Building Plans Approval', desc: 'Submit and track building plan approvals', link: '/services/building' },
        { name: 'Occupation Certificate', desc: 'Certificate of completion and occupation', link: '/services/occupation' },
        { name: 'Demolition Permits', desc: 'Permits for building demolition', link: '/services/demolition' },
      ]
    },
    {
      category: 'Land & Property',
      icon: HomeIcon,
      color: 'bg-green-500',
      services: [
        { name: 'Land Rates Payment', desc: 'Pay property rates and land rent', link: '/services/rates' },
        { name: 'Property Valuation', desc: 'Request property valuation services', link: '/services/valuation' },
        { name: 'Land Use Planning', desc: 'Zoning and land use approvals', link: '/services/planning' },
      ]
    },
    {
      category: 'Municipal Services',
      icon: Truck,
      color: 'bg-primary',
      services: [
        { name: 'Waste Collection', desc: 'Garbage collection and disposal services', link: '/services/waste' },
        { name: 'Water Services', desc: 'Water connection and billing', link: '/services/water' },
        { name: 'Street Lighting', desc: 'Report issues and requests', link: '/services/lighting' },
      ]
    },
    {
      category: 'Health & Environment',
      icon: Heart,
      color: 'bg-red-500',
      services: [
        { name: 'Health Certificates', desc: 'Food handler certificates and inspections', link: '/services/health' },
        { name: 'Environmental Impact', desc: 'EIA approvals and compliance', link: '/services/environment' },
        { name: 'Tree Cutting Permits', desc: 'Permits for tree removal', link: '/services/trees' },
      ]
    },
    {
      category: 'Public Participation',
      icon: Users,
      color: 'bg-purple-500',
      services: [
        { name: 'Public Complaints', desc: 'Submit and track complaints', link: '/report' },
        { name: 'Community Forums', desc: 'Participate in public forums', link: '/services/forums' },
        { name: 'Feedback & Suggestions', desc: 'Share your feedback', link: '/services/feedback' },
      ]
    },
  ]

  const onlineServices = [
    { icon: DollarSign, title: 'Online Payments', desc: 'Pay bills and fees via M-Pesa or card' },
    { icon: FileText, title: 'Download Forms', desc: 'Access all application forms online' },
    { icon: UserCheck, title: 'Track Applications', desc: 'Monitor your application status' },
    { icon: Shield, title: 'Secure Portal', desc: 'Safe and encrypted transactions' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">Citizen Services</h1>
            <p className="text-xl mb-8">
              Fast, efficient, and accessible municipal services for all residents and businesses
            </p>
            <Link to="/report" className="btn bg-white text-primary hover:bg-gray-100">
              Report an Issue
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Online Services Features */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Digital Services</h2>
            <p className="section-subtitle">Access services anytime, anywhere</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {onlineServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <service.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Service Categories</h2>
            <p className="section-subtitle">Browse services by category</p>
          </div>

          <div className="space-y-12">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">{category.category}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.services.map((service, idx) => (
                    <Link
                      key={service.name}
                      to={service.link}
                      className="card group"
                    >
                      <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-gray-600 mb-4">{service.desc}</p>
                      <span className="text-primary font-semibold group-hover:text-gold transition-colors">
                        Access Service →
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Access Services */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title text-white">How to Access Services</h2>
            <p className="section-subtitle text-white/90">Simple steps to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Register on our portal' },
              { step: '02', title: 'Select Service', desc: 'Choose the service you need' },
              { step: '03', title: 'Submit Application', desc: 'Fill and submit the form' },
              { step: '04', title: 'Track Progress', desc: 'Monitor your application' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center"
              >
                <div className="text-5xl font-bold text-gold mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our support team is ready to assist you with any questions or issues
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn btn-primary">
              Contact Us
            </Link>
            <Link to="/faqs" className="btn btn-outline">
              View FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
