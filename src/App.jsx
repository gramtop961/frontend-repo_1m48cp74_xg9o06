import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/70 backdrop-blur sticky top-0 border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-lg">Kenya AI-CRM</div>
          <nav className="text-sm text-gray-600 space-x-4">
            <a href="#" className="hover:text-gray-900">Dashboard</a>
            <a href="/test" className="hover:text-gray-900">Connection Test</a>
          </nav>
        </div>
      </header>
      <Dashboard />
    </div>
  )
}

export default App
