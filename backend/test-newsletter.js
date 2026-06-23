console.log('🧪 Testing Newsletter Subscription...\n')

const testEmail = 'test@example.com'

async function testNewsletterSubscription() {
  try {
    console.log(`📧 Testing subscription with email: ${testEmail}`)
    
    const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail })
    })

    const data = await response.json()
    
    console.log('\n📬 Response Status:', response.status)
    console.log('📬 Response Data:', JSON.stringify(data, null, 2))

    if (data.success) {
      console.log('\n✅ Newsletter subscription test PASSED')
    } else {
      console.log('\n❌ Newsletter subscription test FAILED')
      console.log('Error:', data.error)
    }
  } catch (error) {
    console.error('\n❌ Test Error:', error.message)
    console.error('\nIs the backend server running on port 5000?')
    console.error('Start it with: cd backend && npm run dev')
  }
}

testNewsletterSubscription()
