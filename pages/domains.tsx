import Link from 'next/link'

type Domain = {
  id: string
  name: string
  code: string
  total: number
  met: number
  partial: number
}

const domains: Domain[] = [
  { id: 'ac', name: 'Access Control', code: 'AC', total: 22, met: 10, partial: 5 },
  { id: 'ia', name: 'Identification & Authentication', code: 'IA', total: 11, met: 7, partial: 2 },
  { id: 'si', name: 'System & Information Integrity', code: 'SI', total: 10, met: 4, partial: 3 },
  { id: 'cm', name: 'Configuration Management', code: 'CM', total: 9, met: 5, partial: 1 },
  { id: 'sc', name: 'System & Communication Protection', code: 'SC', total: 27, met: 12, partial: 6 },
  // Add more domains here later
]

const getComplianceColor = (percent: number) => {
  if (percent >= 80) return '#22c55e' // green
  if (percent >= 40) return '#facc15' // yellow
  return '#ef4444' // red
}

export default function DomainsPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
  CMMC Compliance Summary
</h1>


      {domains.map((domain) => {
        const met = domain.met
        const partial = domain.partial
        const total = domain.total
        const percent = Math.round(((met + partial * 0.5) / total) * 100)
        const color = getComplianceColor(percent)

        return (
          <div
            key={domain.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#f9fafb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0 }}>{domain.code} — {domain.name}</h2>
                <p style={{ margin: 0, color: '#666' }}>
                  {met} met, {partial} partial, {total - met - partial} not met
                </p>
              </div>

              <div style={{
                backgroundColor: color,
                color: '#fff',
                fontWeight: 'bold',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem'
              }}>
                {percent}% Compliant
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <Link href={`/domains/${domain.id}`}>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}>
                  View Controls
                </button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
