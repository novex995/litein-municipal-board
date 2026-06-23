import { motion } from 'framer-motion'
import { Users, Target, Eye, Award, History, MapPin } from 'lucide-react'

const About = () => {
  const milestones = [
    { year: '1963', title: 'Town Establishment', desc: 'Litein established as a trading center' },
    { year: '1992', title: 'Municipal Status', desc: 'Granted municipal board status' },
    { year: '2010', title: 'Devolution Era', desc: 'Transition under County Government' },
    { year: '2024', title: 'Smart Municipality', desc: 'Digital transformation initiative launched' },
  ]

  const values = [
    { icon: Award, title: 'Integrity', desc: 'Upholding honesty and transparency in all our operations' },
    { icon: Users, title: 'Citizen-Centered', desc: 'Putting residents at the heart of our services' },
    { icon: Target, title: 'Excellence', desc: 'Committed to delivering quality services' },
    { icon: MapPin, title: 'Innovation', desc: 'Embracing modern solutions for urban development' },
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
            <h1 className="text-5xl font-bold mb-6">About Litein Municipality</h1>
            <p className="text-xl">
              The Administrative and Economic Hub of Bureti Sub-County, Kericho County
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Litein Municipality is strategically located in Litein Town, the administrative 
                headquarters of Bureti Sub-County in Kericho County, within Kenya's tea country region.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                With a population of over 13,000 residents, Litein has evolved from a small trading 
                center to a vibrant urban municipality, known for its rich agricultural heritage and 
                growing commercial sector.
              </p>
              <p className="text-lg text-gray-700">
                Today, we are transforming into a smart municipality, leveraging technology and 
                innovation to deliver efficient, transparent, and citizen-centered services.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/hero-image.png" 
                alt="Litein Municipality" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <Eye className="w-16 h-16 text-primary mb-4" />
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-gray-700">
                A world-class smart municipality offering sustainable and quality services for 
                inclusive development and prosperity for all residents.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <Target className="w-16 h-16 text-gold mb-4" />
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700">
                To provide efficient, innovative, and citizen-centered services through smart 
                governance, strategic partnerships, and sustainable urban development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">The principles that guide our work and service delivery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title text-white">Our Journey</h2>
            <p className="section-subtitle text-white/90">Key milestones in Litein's development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6"
              >
                <div className="text-4xl font-bold text-gold mb-2">{milestone.year}</div>
                <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                <p className="text-white/80">{milestone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Location</h2>
            <p className="section-subtitle">Find us in the heart of Kericho County</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Strategic Position</h3>
              <p className="text-lg text-gray-700 mb-4">
                Litein Municipality is the administrative and economic hub of Bureti Sub-County, 
                strategically located in Litein Town along the Kericho-Kisii highway.
              </p>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Address:</strong> P.O. BOX 742-20202, Kericho, Kenya</span>
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Sub-County:</strong> Bureti, Kericho County</span>
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Region:</strong> Rift Valley, Kenya</span>
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63832.93827575492!2d35.14!3d-0.564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182b7e08f4b1e5e5%3A0x1234567890abcdef!2sLitein%2C%20Kenya!5e0!3m2!1sen!2ske!4v1718539200000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Litein Municipality Location - Bureti Sub-County, Kericho County, Kenya"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
