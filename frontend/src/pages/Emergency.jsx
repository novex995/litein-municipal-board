import { motion } from 'framer-motion'
import { Phone, AlertTriangle, Hospital, Flame, Shield, Wrench } from 'lucide-react'

const Emergency = () => {
  const emergencyContacts = [
    {
      icon: Phone,
      name: 'Emergency Hotline',
      numbers: ['999', '112'],
      description: 'National emergency response for police, fire, and ambulance',
      category: 'critical',
    },
    {
      icon: Shield,
      name: 'Police Emergency',
      numbers: ['999', '0800 721 000'],
      description: 'Report crimes, accidents, or security threats',
      category: 'critical',
    },
    {
      icon: Hospital,
      name: 'Ambulance Services',
      numbers: ['999', '0800 721 300'],
      description: 'Medical emergencies and ambulance dispatch',
      category: 'critical',
    },
    {
      icon: Flame,
      name: 'Fire Brigade',
      numbers: ['999', '0728 602 698'],
      description: 'Fire emergencies and rescue services',
      category: 'critical',
    },
    {
      icon: Phone,
      name: 'Municipality Control Room',
      numbers: ['0712 345 678'],
      description: '24/7 municipal emergency coordination center',
      category: 'municipal',
    },
    {
      icon: Wrench,
      name: 'Water & Sewerage Emergencies',
      numbers: ['0734 567 890'],
      description: 'Burst pipes, sewage overflow, water supply issues',
      category: 'municipal',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Emergency Contacts</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Quick access to emergency services - available 24/7
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-red-900 mb-2">In Case of Emergency</h3>
                <p className="text-red-800">
                  For life-threatening emergencies, always call <strong className="text-2xl">999</strong> or <strong className="text-2xl">112</strong> first. 
                  These numbers connect you to police, ambulance, and fire services.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8">Critical Emergency Services</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {emergencyContacts.filter(c => c.category === 'critical').map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card border-2 border-red-200 hover:border-red-400 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <contact.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{contact.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {contact.numbers.map((number) => (
                        <a
                          key={number}
                          href={`tel:${number}`}
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                          {number}
                        </a>
                      ))}
                    </div>
                    <p className="text-gray-600">{contact.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-8">Municipal Emergency Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {emergencyContacts.filter(c => c.category === 'municipal').map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <contact.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{contact.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {contact.numbers.map((number) => (
                        <a
                          key={number}
                          href={`tel:${number}`}
                          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          {number}
                        </a>
                      ))}
                    </div>
                    <p className="text-gray-600">{contact.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Emergency
