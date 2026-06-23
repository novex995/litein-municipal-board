import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Share2, Eye, Tag } from 'lucide-react'

const NewsDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])

  useEffect(() => {
    fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news/${slug}`)
      
      if (!response.ok) {
        throw new Error('Article not found')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setArticle(data.data)
        // Fetch related articles in the same category
        fetchRelatedNews(data.data.category)
      } else {
        setError('Failed to load article')
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedNews = async (category) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news?category=${category}&limit=3`)
      const data = await response.json()
      
      if (data.success) {
        // Filter out the current article
        const filtered = data.data.filter(item => item.slug !== slug)
        setRelatedNews(filtered.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching related news:', error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/media/news" className="btn btn-primary">
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  if (!article) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-br from-primary to-primary-700 text-white">
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-gold transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <span className="inline-block bg-gold text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
            {article.excerpt && (
              <p className="text-xl text-white/90">{article.excerpt}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Article Meta */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {article.views || 0} views
                    </span>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 text-primary hover:text-gold transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Featured Image */}
                {article.featured_image && (
                  <div className="relative h-96">
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Article Body */}
                <div className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {article.content}
                    </div>
                  </div>
                </div>

                {/* Article Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm font-semibold text-primary">{article.category}</span>
                    </div>
                    <button
                      onClick={handleShare}
                      className="btn btn-outline btn-sm"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Article
                    </button>
                  </div>
                </div>
              </motion.article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related News */}
              {relatedNews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-lg shadow-sm p-6 mb-6"
                >
                  <h3 className="text-xl font-bold mb-4">Related News</h3>
                  <div className="space-y-4">
                    {relatedNews.map((news) => (
                      <Link
                        key={news.id}
                        to={`/media/news/${news.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          {news.featured_image && (
                            <img
                              src={news.featured_image}
                              alt={news.title}
                              className="w-20 h-20 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                              {news.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {new Date(news.published_at || news.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/media/news"
                    className="block text-center text-primary font-semibold text-sm mt-4 hover:text-gold transition-colors"
                  >
                    View All News →
                  </Link>
                </motion.div>
              )}

              {/* Back to News */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-primary text-white rounded-lg p-6"
              >
                <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                <p className="text-sm mb-4">
                  Get the latest news and updates from Litein Municipality
                </p>
                <Link to="/media/news" className="btn bg-gold text-white hover:bg-gold-600 w-full">
                  View All News
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NewsDetail
