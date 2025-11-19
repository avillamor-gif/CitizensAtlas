// Environment Variables Verification for Vercel
// Copy these EXACT values to your Vercel dashboard

console.log('🔧 VERCEL ENVIRONMENT VARIABLES')
console.log('================================')
console.log('')
console.log('Copy these exact values to https://vercel.com/dashboard -> Project Settings -> Environment Variables')
console.log('')

const envVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'https://srsjynjccivtjvordrlc.supabase.co',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDE3NjUsImV4cCI6MjA3Mzc3Nzc2NX0.YOyYebTJSgq0bEcBQDXsNCiK6WPvB8lViSKtquzkdGE',
  'SUPABASE_SERVICE_ROLE_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyc2p5bmpjY2l2dGp2b3JkcmxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODIwMTc2NSwiZXhwIjoyMDczNzc3NzY1fQ.sXesnBbiwklHz0dzc4WoXWS38R7HZKGM1cdMOyfc__g',
  'NEXT_PUBLIC_SITE_URL': 'https://citizens-atlas.vercel.app',
  'NEXT_PUBLIC_APP_URL': 'https://citizens-atlas.vercel.app',
  'RESEND_API_KEY': 're_h3LwArvg_9HqK6GRaEDNauLxUTVoZYSuG',
  'RESEND_FROM': 'Atlas CMS <onboarding@resend.dev>',
  'NEXT_PUBLIC_ADMIN_EMAIL': 'akawar@gmail.com',
  'CLOUDINARY_CLOUD_NAME': 'dbfc3xnv8',
  'CLOUDINARY_API_KEY': '867374726179445',
  'CLOUDINARY_API_SECRET': 'OmfHGeS95tIIEMA0LoptghBMMwk'
}

console.log('📋 Environment Variables to Set:')
console.log('================================')

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}=${value}`)
})

console.log('')
console.log('🚨 CRITICAL STEPS:')
console.log('1. Copy ALL the above variables to Vercel dashboard')
console.log('2. Make sure there are no extra spaces or characters')
console.log('3. Save and trigger a new deployment')
console.log('4. Wait for deployment to complete')
console.log('')
console.log('🔗 Vercel Dashboard: https://vercel.com/dashboard')
console.log('🌐 Production Site: https://citizens-atlas.vercel.app')