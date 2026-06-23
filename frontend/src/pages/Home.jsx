import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Users, Phone, BookOpen,
  MessageSquare, Download, Newspaper,
  MapPin, Calendar, FileText, Megaphone, Target, Briefcase
} from 'lucide-react'
import HeroSlider from '../components/HeroSlider'

const Home = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState({ type: '', text: '' })
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  // Fetch latest news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news?limit=3')
        const data = await response.json()
        if (data.success) {
          setNews(data.data)
        }
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [])

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    setNewsletterLoading(true)
    setNewsletterMessage({ type: '', text: '' })

    try {
      const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      })

      const data = await response.json()

      if (data.success) {
        setNewsletterMessage({ type: 'success', text: data.message })
        setNewsletterEmail('')
      } else {
        setNewsletterMessage({ type: 'error', text: data.error })
      }
    } catch (error) {
      setNewsletterMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' })
    } finally {
      setNewsletterLoading(false)
    }
  }

  const services = [
    { icon: Briefcase, image: '/opportunities.png', title: 'Projects', desc: 'View ongoing municipal projects', link: '/projects' },
    { icon: Users, image: '/litein-market.png', title: 'Board Members', desc: 'Meet our municipal board leadership', link: '/board/members' },
    { icon: MessageSquare, image: '/citizen.png', title: 'Public Grievance', desc: 'Report issues and track resolution', link: '/grievance' },
    { icon: Phone, image: '/lands.png', title: 'Contact Us', desc: 'Get in touch with us', link: '/contact' },
  ]

  const smartPillars = [
    { 
      title: 'News & Updates', 
      icon: '📢',
      image: '/media.png',
      desc: 'Latest municipal news and announcements',
      link: '/media/news'
    },
    { 
      title: 'Resource Centre', 
      icon: '📚',
      image: '/Resources.png',
      desc: 'Documents, downloads, and public records',
      link: '/downloads'
    },
    { 
      title: 'Board Leadership', 
      icon: '👥',
      image: '/Board.png',
      desc: 'Municipal board members and staff',
      link: '/board/members'
    },
    { 
      title: 'Projects', 
      icon: '🏗️',
      image: '/opportunities.png',
      desc: 'Ongoing and completed municipal projects',
      link: '/projects'
    },
    { 
      title: 'Grievance', 
      icon: '🤝',
      image: '/citizen.png',
      desc: 'Report issues and track resolution',
      link: '/grievance'
    },
    { 
      title: 'About Us', 
      icon: '💻',
      image: '/E-services.png',
      desc: 'Learn about Litein Municipality',
      link: '/about'
    },
  ]

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Latest News */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest News & Announcements</h2>
            <p className="section-subtitle">Stay updated with what's happening in Litein</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsLoading ? (
            <div className="col-span-3 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          ) : news.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600">No news articles available yet.</p>
            </div>
          ) : (
            news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group cursor-pointer h-full"
              >
                <Link to={`/media/news/${item.slug}`} className="card group p-0 overflow-hidden h-full flex flex-col hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={item.featured_image || '/litein-aerial-view.png'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-4 text-xs text-white/90">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.published_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        {item.author && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.author.full_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-primary font-semibold group-hover:text-gold transition-colors inline-flex items-center gap-2">
                        Read Full Story
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
          </div>

          <div className="text-center mt-12">
            <Link to="/media/news" className="btn btn-outline inline-flex items-center gap-2 group">
              View All News & Announcements
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Services */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Quick Access Services</h2>
            <p className="section-subtitle">Fast and efficient municipal services at your fingertips</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Link to={service.link} className="card h-full group block">
                  {service.image ? (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden mx-auto">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors overflow-hidden mx-auto">
                      <service.icon className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">{service.title}</h3>
                  <p className="text-gray-600 mb-6 text-center">{service.desc}</p>
                  <span className="text-primary font-semibold group-hover:text-gold transition-colors block text-center">
                    Access Service →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">About Litein Municipality</h2>
              <p className="text-lg text-gray-600 mb-6">
                Litein Municipal Board is the administrative and economic hub of Bureti Sub-County in Kericho County, Kenya, 
                located in Litein Town. Known as the heart of Kenya's tea country, Litein is transforming into a modern smart municipality.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src="/vision.png" alt="Vision" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Vision</h3>
                    <p className="text-gray-600">A world-class smart municipality offering sustainable and quality services for inclusive development.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src="/mision.png" alt="Mission" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Mission</h3>
                    <p className="text-gray-600">To provide efficient, innovative and citizen-centered services through smart governance and strategic partnerships.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/about" className="btn btn-primary mt-6">
                Learn More About Us
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative overflow-hidden"
            >
              <img 
                src="/estate.png" 
                alt="Litein Municipality" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl z-10">
                <div className="text-4xl font-bold text-primary mb-2">60+</div>
                <div className="text-gray-600">Years of Service</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Smart Municipality Pillars */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-700 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="section-header">
            <h2 className="section-title text-white">Our Key Focus Areas</h2>
            <p className="section-subtitle text-white/90">Delivering excellence through strategic municipal services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={pillar.link}
                  className="block relative h-64 rounded-xl overflow-hidden group cursor-pointer"
                >
                  {/* Background Image */}
                  {pillar.image ? (
                    <img 
                      src={pillar.image} 
                      alt={pillar.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-6xl">
                      {pillar.icon}
                    </div>
                  )}
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-gold transition-colors">{pillar.title}</h3>
                      <p className="text-white/90 mb-4 leading-relaxed text-sm">{pillar.desc}</p>
                      <span className="text-gold font-semibold group-hover:text-white transition-colors inline-flex items-center gap-2">
                        Learn More 
                        <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Additional Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Building a Smart, Sustainable and Prosperous Litein</h3>
            <p className="text-white/90 text-lg max-w-3xl mx-auto mb-6">
              Through innovative governance, transparent service delivery, and active citizen participation, 
              we are transforming Litein into a model municipality for Kenya.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/about/vision-mission" className="btn bg-white text-primary hover:bg-gold hover:text-white">
                Our Vision & Mission
              </Link>
              <Link to="/about/profile" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary">
                Municipality Profile
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-block p-2 bg-primary/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold mb-3">Stay Connected with Litein</h2>
              <p className="text-base text-gray-300 mb-6">
                Subscribe to our newsletter and be the first to know about new services, 
                announcements, tenders, and important municipal updates.
              </p>

              <div className="max-w-xl mx-auto">
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={newsletterLoading}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe Now'}
                    {!newsletterLoading && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </button>
                </form>

                {newsletterMessage.text && (
                  <div className={`text-sm p-3 rounded-lg mb-4 ${
                    newsletterMessage.type === 'success' 
                      ? 'bg-green-500/20 text-green-100 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-100 border border-red-500/30'
                  }`}>
                    {newsletterMessage.text}
                  </div>
                )}

                <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Join 5,000+ subscribers already receiving updates
                </p>
              </div>

              {/* Benefits - Removed the three cards section */}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
