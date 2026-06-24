import { supabaseAdmin } from '../config/supabase.js'

/**
 * Get all published news articles
 * @route GET /api/news
 */
export const getPublishedNews = async (req, res) => {
  try {
    const { category, limit = 10, offset = 0 } = req.query

    let query = supabaseAdmin
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (limit) {
      query = query.range(offset, parseInt(offset) + parseInt(limit) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching news:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch news articles'
      })
    }

    console.log(`✓ Fetched ${data?.length || 0} news articles`)

    return res.json({
      success: true,
      data: data || [],
      total: data?.length || 0,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}

/**
 * Get single news article by slug
 * @route GET /api/news/:slug
 */
export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'News article not found'
      })
    }

    // Increment views
    await supabaseAdmin
      .from('news')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id)

    return res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}

/**
 * Get all news (including drafts) - Admin only
 * @route GET /api/news/admin/all
 */
export const getAllNews = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all news:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch news'
      })
    }

    return res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}

/**
 * Create news article - Staff and above
 * @route POST /api/news
 */
export const createNews = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      featured_image,
      category,
      published = false
    } = req.body

    const userId = req.user.id

    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        error: 'Title, content, and category are required'
      })
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now()

    const newsData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      featured_image,
      category,
      author_id: userId,
      published,
      published_at: published ? new Date().toISOString() : null
    }

    const { data, error } = await supabaseAdmin
      .from('news')
      .insert([newsData])
      .select()
      .single()

    if (error) {
      console.error('Error creating news:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create news article'
      })
    }

    return res.status(201).json({
      success: true,
      data,
      message: published ? 'News article published successfully' : 'News article saved as draft'
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}

/**
 * Update news article - Author or Admin
 * @route PUT /api/news/:id
 */
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params
    const {
      title,
      content,
      excerpt,
      featured_image,
      category,
      published
    } = req.body

    console.log('📝 Update news request:', {
      id,
      userId: req.user?.id,
      userRole: req.user?.role,
      updates: { title, content: content?.substring(0, 50) + '...', category, published }
    })

    const userId = req.user.id
    const userRole = req.user.role

    // Check if news exists
    const { data: existingNews, error: fetchError } = await supabaseAdmin
      .from('news')
      .select('author_id, title')
      .eq('id', id)
      .single()

    if (fetchError || !existingNews) {
      console.error('❌ News article not found:', id, fetchError)
      return res.status(404).json({
        success: false,
        error: 'News article not found'
      })
    }

    console.log('✓ Found article:', existingNews.title, 'Author:', existingNews.author_id)

    // Check permissions
    const isAdmin = ['super_admin', 'municipal_manager'].includes(userRole)
    const isAuthor = existingNews.author_id === userId

    console.log('🔐 Permission check:', {
      userRole,
      isAdmin,
      isAuthor,
      articleAuthor: existingNews.author_id,
      currentUser: userId
    })

    if (!isAdmin && !isAuthor) {
      console.error('❌ Permission denied: User not author or admin')
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to edit this article'
      })
    }

    // Generate new slug if title changed
    let slug
    if (title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    const updateData = {
      ...(title && { title, slug }),
      ...(content && { content }),
      ...(excerpt && { excerpt }),
      ...(featured_image !== undefined && { featured_image }),
      ...(category && { category }),
      ...(published !== undefined && {
        published,
        published_at: published ? new Date().toISOString() : null
      })
    }

    console.log('📤 Updating article with data:', Object.keys(updateData))

    const { data, error } = await supabaseAdmin
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase update error:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update news article: ' + error.message
      })
    }

    console.log('✅ Article updated successfully:', data.title)

    return res.json({
      success: true,
      data,
      message: 'News article updated successfully'
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}

/**
 * Delete news article - Admin only
 * @route DELETE /api/news/:id
 */
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabaseAdmin
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting news:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete news article'
      })
    }

    return res.json({
      success: true,
      message: 'News article deleted successfully'
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}

/**
 * Get news categories
 * @route GET /api/news/categories
 */
export const getNewsCategories = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('category')
      .eq('published', true)

    if (error) {
      console.error('Error fetching categories:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch categories'
      })
    }

    const categories = [...new Set(data.map(item => item.category))].filter(Boolean)

    return res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}
