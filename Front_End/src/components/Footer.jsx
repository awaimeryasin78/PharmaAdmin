import { Mail, Phone } from 'lucide-react'

const Footer = ({ isMobile }) => {
    return (
        <div style={{
            paddingTop: '20px',
            borderTop: '0.5px solid var(--border-card)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: '10px',
            fontSize: '12px',
            color: 'var(--text-muted)'
        }}>
            <div>
                © {new Date().getFullYear()} PharmaAdmin. Designed &amp; built by{' '}
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Awaimer Taha Yasin</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingBottom: '4px' }}>
                <a
                    href="mailto:awaimeryasin78@gmail.com"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none' }}
                >
                    <Mail size={13} /> awaimeryasin78@gmail.com
                </a>
                <a
                    href="tel:+923214028926"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none' }}
                >
                    <Phone size={13} /> +92 321 4028926
                </a>
            </div>
        </div>
    )
}

export default Footer
