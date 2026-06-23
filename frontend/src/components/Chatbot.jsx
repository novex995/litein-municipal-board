import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, RefreshCw } from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Litein Municipal Board's virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Knowledge base for the chatbot
  const knowledgeBase = {
    greetings: {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
      responses: [
        "Hello! Welcome to Litein Municipal Board. How can I assist you today?",
        "Hi there! I'm here to help you with information about our services.",
        "Greetings! What can I help you with today?"
      ]
    },
    services: {
      keywords: ['service', 'services', 'what do you offer', 'what can you do', 'help with'],
      response: "Litein Municipal Board offers various services including:\n\n" +
        "📋 Grievance reporting and tracking\n" +
        "🏗️ Development projects information\n" +
        "📰 News and announcements\n" +
        "👥 Board and staff information\n" +
        "📞 Contact and support services\n" +
        "💼 Business permits and licenses\n\n" +
        "What specific service are you interested in?"
    },
    grievance: {
      keywords: ['complaint', 'grievance', 'report issue', 'problem', 'complain', 'issue', 'report'],
      response: "To file a grievance:\n\n" +
        "1. Go to the Grievance page from the main menu\n" +
        "2. Click 'Lodge a Complaint' tab\n" +
        "3. Fill in your details and complaint information\n" +
        "4. Submit and you'll receive a tracking number via email\n\n" +
        "You can also track existing complaints using your reference number. Would you like me to direct you to the Grievance page?"
    },
    tracking: {
      keywords: ['track', 'tracking', 'status', 'reference number', 'check complaint', 'check status'],
      response: "To track your complaint:\n\n" +
        "1. Visit the Grievance page\n" +
        "2. Click 'Complaint Tracking' tab\n" +
        "3. Enter your reference number (e.g., GRV-2026-001)\n" +
        "4. Click 'Track' to view your complaint status\n\n" +
        "Your reference number was sent to your email after submission."
    },
    contact: {
      keywords: ['contact', 'phone', 'email', 'reach', 'call', 'address', 'location'],
      response: "Contact Litein Municipal Board:\n\n" +
        "📧 Email: info@liteinmunicipal.go.ke\n" +
        "📞 Phone: +254 700 000 000\n" +
        "🏢 Address: Litein Town, Kericho County, Kenya\n\n" +
        "Office Hours:\n" +
        "Monday - Friday: 8:00 AM - 5:00 PM\n" +
        "Saturday: 8:00 AM - 12:00 PM\n" +
        "Sunday: Closed"
    },
    projects: {
      keywords: ['project', 'projects', 'development', 'construction', 'ongoing'],
      response: "View our development projects:\n\n" +
        "Visit the Projects page to see:\n" +
        "• Ongoing projects\n" +
        "• Completed projects\n" +
        "• Planned developments\n" +
        "• Project budgets and timelines\n\n" +
        "You can filter projects by status, category, or location."
    },
    news: {
      keywords: ['news', 'announcement', 'announcements', 'updates', 'latest', 'recent'],
      response: "Stay updated with Litein Municipal Board:\n\n" +
        "Visit our News section for:\n" +
        "• Latest announcements\n" +
        "• Municipal updates\n" +
        "• Community events\n" +
        "• Public notices\n\n" +
        "News is updated regularly to keep you informed."
    },
    staff: {
      keywords: ['staff', 'board', 'leadership', 'members', 'who', 'team', 'management'],
      response: "Learn about our leadership:\n\n" +
        "Board Leadership page features:\n" +
        "• Board Members\n" +
        "• Municipal Staff\n" +
        "• Contact information\n" +
        "• Roles and responsibilities\n\n" +
        "You can view detailed profiles and reach out directly."
    },
    hours: {
      keywords: ['hours', 'open', 'close', 'working hours', 'office hours', 'when', 'time'],
      response: "Office Hours:\n\n" +
        "Monday - Friday: 8:00 AM - 5:00 PM\n" +
        "Saturday: 8:00 AM - 12:00 PM\n" +
        "Sunday: Closed\n\n" +
        "Public Holidays: Closed\n\n" +
        "For urgent matters outside office hours, you can submit a grievance online anytime."
    },
    payment: {
      keywords: ['pay', 'payment', 'fee', 'bill', 'how to pay', 'cost', 'charge'],
      response: "Payment Information:\n\n" +
        "Payment methods:\n" +
        "• M-Pesa\n" +
        "• Bank transfer\n" +
        "• Cash at municipal offices\n\n" +
        "For specific service fees and payment procedures, please contact our finance office at +254 700 000 000."
    },
    license: {
      keywords: ['license', 'permit', 'business', 'approval', 'authorization'],
      response: "Business Licenses & Permits:\n\n" +
        "Required documents:\n" +
        "• Business registration certificate\n" +
        "• National ID/Passport\n" +
        "• Location/premises details\n\n" +
        "Visit our offices or contact us for:\n" +
        "• Application forms\n" +
        "• Processing fees\n" +
        "• Requirements\n\n" +
        "Processing time: 7-14 business days"
    },
    thanks: {
      keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
      responses: [
        "You're welcome! Feel free to ask if you need anything else.",
        "Happy to help! Don't hesitate to reach out again.",
        "My pleasure! Have a great day!"
      ]
    },
    bye: {
      keywords: ['bye', 'goodbye', 'see you', 'later'],
      responses: [
        "Goodbye! Have a wonderful day!",
        "Take care! Feel free to come back anytime.",
        "See you later! We're here whenever you need us."
      ]
    }
  }

  // Quick action buttons
  const quickActions = [
    { label: 'File a Complaint', keyword: 'complaint' },
    { label: 'Track Complaint', keyword: 'tracking' },
    { label: 'View Projects', keyword: 'projects' },
    { label: 'Contact Us', keyword: 'contact' }
  ]

  // Get bot response based on user input
  const getBotResponse = (userMessage) => {
    const lowercaseMessage = userMessage.toLowerCase().trim()

    // Check each category in knowledge base
    for (const [category, data] of Object.entries(knowledgeBase)) {
      const matched = data.keywords.some(keyword => 
        lowercaseMessage.includes(keyword.toLowerCase())
      )

      if (matched) {
        if (Array.isArray(data.responses)) {
          // Random response from array
          return data.responses[Math.floor(Math.random() * data.responses.length)]
        } else {
          return data.response
        }
      }
    }

    // Default response if no match found
    return "I'm here to help! I can assist you with:\n\n" +
      "• Filing and tracking complaints\n" +
      "• Information about our services\n" +
      "• Contact details\n" +
      "• Project updates\n" +
      "• Office hours\n\n" +
      "Please ask me a specific question or use the quick action buttons below."
  }

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot thinking and responding
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay 1-2 seconds
  }

  // Handle quick action click
  const handleQuickAction = (keyword) => {
    setInputMessage(keyword)
    setTimeout(() => handleSendMessage(), 100)
  }

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Reset conversation
  const handleReset = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm Litein Municipal Board's virtual assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ])
  }

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat with us!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Litein Assistant</h3>
                <p className="text-xs text-green-100">Always here to help</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'bot' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {message.sender === 'bot' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[75%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'bot'
                          ? 'bg-white border border-gray-200 text-gray-800'
                          : 'bg-gradient-to-br from-green-600 to-green-700 text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      </div>
                      <span className="text-xs text-gray-400 px-2">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600 mb-2 font-medium">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.keyword)}
                      className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full text-xs font-medium hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="px-4 py-3 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • Shift+Enter for new line
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default Chatbot
