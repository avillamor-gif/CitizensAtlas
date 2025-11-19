import React from 'react'

export default function EnvTest() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Test</h1>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
      
      <h2>All Environment Variables (development only)</h2>
      <pre>{JSON.stringify(process.env, null, 2)}</pre>
    </div>
  )
}