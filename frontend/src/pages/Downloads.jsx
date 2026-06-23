import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Folder, Search } from 'lucide-react'

const Downloads = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Documents', count: 24 },
    { id: 'forms', name: 'Application Forms', count: 8 },
    { id: 'reports', name: 'Reports', count: 6 },
    { id: 'policies', name: 'Policies', count: 5 },
    { id: 'guidelines', name: 'Guidelines', count: 5 },
  ]

  const documents = [
    { name: 'Business License Application Form', category: 'forms', size: '245 KB', format: 'PDF' },
    { name: 'Building Approval Application Form', category: 'forms', size: '312 KB', format: 'PDF' },
    { name: 'Market Stall Application Form', category: 'forms', size: '198 KB', format: 'PDF' },
    { name: 'Land Rates Payment Guide', category: 'guidelines', size: '420 KB', format: 'PDF' },
    { name: 'Municipality Annual Report 2025', category: 'reports', size: '2.4 MB', format: 'PDF' },
    { name: 'Waste Management Policy', category: 'policies', size: '1.1 MB', format: 'PDF' },
    { name: 'Building Code Standards', category: 'guidelines', size: '3.2 MB', format: 'PDF' },
    { name: 'Revenue Collection Report Q1 2026', category: 'reports', size: '890 KB', format: 'PDF' },
  ]

  const filteredDocs = activeCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-primary-700 text-white py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Download className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Downloads</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Forms, reports, and public documents
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h3 className="font-bold mb-4">Categories</h3>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    activeCategory === cat.id 
                      ? 'bg-primary text-white' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    {cat.name}
                  </span>
                  <span className="text-sm">{cat.count}</span>
                </button>
              ))}
            </div>

            <div className="md:col-span-3 space-y-3">
              {filteredDocs.map((doc, index) => (
                <motion.div
                  key={doc.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{doc.name}</h3>
                      <p className="text-sm text-gray-600">
                        {doc.format} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <button className="btn btn-primary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Downloads
