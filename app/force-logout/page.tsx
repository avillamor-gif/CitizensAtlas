'use client'

export default function ForceLogoutPage() {
  // Clear storage immediately on render
  if (typeof window !== 'undefined') {
    localStorage.clear()
    sessionStorage.clear()
    setTimeout(() => {
      window.location.replace('/auth/login')
    }, 100)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '24px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <script dangerouslySetInnerHTML={{
        __html: `
          localStorage.clear();
          sessionStorage.clear();
          setTimeout(function() {
            window.location.replace('/auth/login');
          }, 100);
        `
      }} />
      Clearing session...
    </div>
  )
}
