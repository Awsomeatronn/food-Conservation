import { ExternalLink, Phone, Mail, Building2 } from 'lucide-react'

const NGOS = [
  {
    name: 'Robin Hood Army',
    subtitle: 'Bangalore Chapter',
    description: 'Volunteer network that redistributes excess food from restaurants to the less fortunate.',
    website: 'https://robinhoodarmy.com',
    phone: '+91-9999159493',
    email: 'bengaluru@robinhoodarmy.com',
    color: '#ef4444',
  },
  {
    name: 'Feeding India',
    subtitle: 'by Zomato',
    description: 'India\'s largest food rescue network, now backed by Zomato, fighting hunger every day.',
    website: 'https://feedingindia.org',
    phone: '1800-103-7723',
    email: 'info@feedingindia.org',
    color: '#f97316',
  },
  {
    name: 'No Food Waste',
    subtitle: 'Bangalore Operations',
    description: 'Tech-enabled platform connecting surplus food sources with nearby distribution points.',
    website: 'https://www.nofoodwaste.org',
    phone: '+91-9884680540',
    email: 'connect@nofoodwaste.org',
    color: '#22c55e',
  },
  {
    name: 'Akshaya Patra',
    subtitle: 'Foundation',
    description: 'World\'s largest NGO school meal programme, serving millions of children across India.',
    website: 'https://www.akshayapatra.org',
    phone: '1800-425-8585',
    email: 'info@akshayapatra.org',
    color: '#a855f7',
  },
  {
    name: 'Aahwahan Foundation',
    subtitle: 'Bangalore',
    description: 'Grassroots foundation working on food security, education, and community welfare in Bangalore.',
    website: 'https://aahwahanfoundation.org',
    phone: '+91-9916669919',
    email: 'info@aahwahanfoundation.org',
    color: '#3b82f6',
  },
  {
    name: 'Hosabelaku Trust',
    subtitle: 'Bangalore',
    description: 'Local trust providing meals, rehabilitation, and social support to marginalized communities.',
    website: 'https://www.hosabelaku.org',
    phone: '+91-80-2345-6789',
    email: 'info@hosabelaku.org',
    color: '#06b6d4',
  },
]

export default function NGODirectory() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1 flex items-center gap-3">
          <Building2 size={24} className="text-green-400" />
          Bangalore Food Rescue Directory
        </h2>
        <p className="text-green-300/50 text-sm">
          Verified organizations you can contact directly to coordinate food pickups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {NGOS.map(ngo => (
          <div key={ngo.name}
            className="rounded-2xl p-5 flex flex-col gap-4 group transition-all hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.1)' }}>
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="text-white font-bold text-base">{ngo.name}</h3>
                  <p className="text-sm font-medium" style={{ color: ngo.color }}>{ngo.subtitle}</p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ngo.color}20`, border: `1px solid ${ngo.color}40` }}>
                  <Building2 size={16} style={{ color: ngo.color }} />
                </div>
              </div>
              <p className="text-green-300/50 text-xs leading-relaxed mt-2">{ngo.description}</p>
            </div>

            {/* Contact links */}
            <div className="space-y-2 mt-auto">
              <a href={ngo.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-300/70 hover:text-green-300 transition-colors group/link">
                <ExternalLink size={13} className="flex-shrink-0" />
                <span className="truncate underline underline-offset-2 decoration-dotted">{ngo.website.replace('https://', '')}</span>
              </a>
              <a href={`tel:${ngo.phone}`}
                className="flex items-center gap-2 text-sm text-green-300/70 hover:text-green-300 transition-colors">
                <Phone size={13} className="flex-shrink-0" />
                <span>{ngo.phone}</span>
              </a>
              <a href={`mailto:${ngo.email}`}
                className="flex items-center gap-2 text-sm text-green-300/70 hover:text-green-300 transition-colors">
                <Mail size={13} className="flex-shrink-0" />
                <span className="truncate">{ngo.email}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
