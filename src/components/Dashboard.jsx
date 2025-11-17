import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard() {
  const [tenantId, setTenantId] = useState('demo-tenant')
  const [leads, setLeads] = useState([])
  const [proposals, setProposals] = useState([])
  const [status, setStatus] = useState('')

  const fetchData = async () => {
    try {
      const [lRes, pRes] = await Promise.all([
        fetch(`${API_BASE}/leads?tenant_id=${tenantId}`),
        fetch(`${API_BASE}/proposals?tenant_id=${tenantId}`)
      ])
      const [l, p] = await Promise.all([lRes.json(), pRes.json()])
      setLeads(Array.isArray(l) ? l : [])
      setProposals(Array.isArray(p) ? p : [])
      setStatus('✅ Connected')
    } catch (e) {
      setStatus('❌ Backend not reachable')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const seedLead = async () => {
    try {
      await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, source: 'web', name: 'New Lead' })
      })
      fetchData()
    } catch (e) {}
  }

  const seedProposal = async () => {
    try {
      const leadId = leads[0]?._id || 'unknown'
      await fetch(`${API_BASE}/proposals/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          lead_id: leadId,
          items: [
            { title: 'Website Revamp', quantity: 1, unit_price_kes: 50000 },
            { title: 'SEO Package', quantity: 1, unit_price_kes: 15000 }
          ]
        })
      })
      fetchData()
    } catch (e) {}
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Kenya AI-CRM</h1>
        <div className="text-sm text-gray-600">{status}</div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Leads</h2>
            <button onClick={seedLead} className="px-3 py-1 rounded bg-blue-600 text-white">Add Lead</button>
          </div>
          <ul className="divide-y">
            {leads.map((l) => (
              <li key={l._id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{l.name || 'Unnamed Lead'}</div>
                  <div className="text-xs text-gray-500">{l.source} • {l.status}</div>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{l._id?.slice(-6)}</span>
              </li>
            ))}
            {leads.length === 0 && <li className="text-sm text-gray-500">No leads yet</li>}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Proposals</h2>
            <button onClick={seedProposal} className="px-3 py-1 rounded bg-emerald-600 text-white">Draft</button>
          </div>
          <ul className="divide-y">
            {proposals.map((p) => (
              <li key={p._id} className="py-2">
                <div className="font-medium">{p.status} • KES {p.total_kes}</div>
                <div className="text-xs text-gray-500">Items: {p.items?.length || 0}</div>
              </li>
            ))}
            {proposals.length === 0 && <li className="text-sm text-gray-500">No proposals</li>}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Daily AI Brief (placeholder)</h2>
        <p className="text-sm text-gray-600">This area will summarize pipeline, leads, and tasks once AI jobs are configured.</p>
      </div>
    </div>
  )
}
