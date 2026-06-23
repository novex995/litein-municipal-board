import { motion } from 'framer-motion'
import { Calendar, MapPin, User, ArrowRight, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NewsUpdates = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [newsArticles, setNewsArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['All'])

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/news')
      const data = await response.json()
      
      if (data.success) {
        setNewsArticles(data.data)
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.data.map(item => item.category))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading news...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="relative py-20 bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">News and Updates</h1>
            <p className="text-xl">Latest news, announcements, and updates from Litein Municipality</p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-gray-50 sticky top-20 z-40">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {filteredNews.filter(n => n.featured).length > 0 && (
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
            {filteredNews.filter(n => n.featured).map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {article.featured_image && (
                    <img src={article.featured_image} alt={article.title} className="w-full h-80 object-cover" />
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">Featured</span>
                      <span className="bg-gold text-white px-3 py-1 rounded-full text-xs font-semibold">{article.category}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">{article.title}</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.published_at || article.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Link to={`/media/news/${article.slug}`} className="text-primary font-semibold hover:text-gold transition-colors inline-flex items-center gap-2 group">
                      Read Full Story
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-12 pb-20">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">{selectedCategory === 'All' ? 'All News' : `${selectedCategory} News`}</h2>
          
          {filteredNews.filter(n => !n.featured).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.filter(n => !n.featured).map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  <Link to={`/media/news/${article.slug}`}>
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={article.featured_image || '/estate.png'}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.published_at || article.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <span className="text-primary font-semibold text-sm hover:text-gold transition-colors inline-flex items-center gap-2 group">
                        Read More
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default NewsUpdates
