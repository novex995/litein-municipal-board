import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const slides = [
    {
      id: 1,
      title: 'Welcome to Litein Municipal Board',
      subtitle: 'A Smart, Sustainable and Prosperous Litein',
      description: 'Building a connected municipality driving sustainable development and quality service delivery',
      image: '/hero-image.png',
      gradient: 'from-black/30 to-black/20',
      cta: { text: 'Learn More', link: '/about' }
    },
    {
      id: 2,
      title: 'Litein Market Modernization Project',
      subtitle: 'Building Better Trading Infrastructure',
      description: 'Construction of modern market stalls with improved facilities, electricity and water supply - 65% complete',
      image: '/litein-aerial-view.png',
      gradient: 'from-black/30 to-black/20',
      cta: { text: 'View Projects', link: '/projects' }
    },
    {
      id: 3,
      title: 'News & Updates',
      subtitle: 'Stay Informed',
      description: 'Get the latest news, announcements and updates from Litein Municipal Board',
      image: '/County%20Board.png',
      gradient: 'from-black/30 to-black/20',
      cta: { text: 'Read News', link: '/media/news' }
    },
    {
      id: 4,
      title: 'Report Issues 24/7',
      subtitle: 'Your Voice Matters',
      description: 'Report grievances and issues directly to us and track resolution progress',
      image: '/hero-image.png',
      gradient: 'from-black/30 to-black/20',
      cta: { text: 'Report an Issue', link: '/grievance' }
    }
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000) // Change slide every 8 seconds

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            {/* Overlay with unique gradient per slide */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center z-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl text-white">
                <h2 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in-up">
                  {slide.title}
                </h2>
                <p className="text-2xl md:text-3xl mb-4 text-green-400 animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </p>
                <p className="text-lg md:text-xl mb-8 text-gray-200 animate-fade-in-up animation-delay-400">
                  {slide.description}
                </p>
                <div className="animate-fade-in-up animation-delay-600">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Button clicked, navigating to:', slide.cta.link)
                      navigate(slide.cta.link)
                    }}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300 relative z-30 cursor-pointer shadow-lg"
                  >
                    {slide.cta.text}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors duration-300 text-white z-40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors duration-300 text-white z-40"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-40">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-green-500 w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  )
}

export default HeroSlider
