export default function SimplePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Citizens Atlas - Production Test
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        If you can see this, the deployment is working!
      </p>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-semibold mb-4">Environment Check:</h2>
        <ul className="space-y-2">
          <li>✅ Page loads correctly</li>
          <li>✅ Styling works</li>
          <li>✅ Basic functionality operational</li>
        </ul>
      </div>

      <div className="mt-8 space-x-4">
        <a 
          href="/" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Main Site
        </a>
        <a 
          href="/debug" 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Debug Info
        </a>
        <a 
          href="/auth/login" 
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Login Page
        </a>
      </div>
    </div>
  )
}