import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Footer from './Footer'
import { useIsMobile } from '../hooks/useIsMobile'

const Layout = ({ children, title }) => {
    const isMobile = useIsMobile()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
            <Sidebar
                isMobile={isMobile}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div style={{
                marginLeft: isMobile ? 0 : '240px',
                flex: 1,
                width: '100%',
                minWidth: 0
            }}>
                <Topbar
                    title={title}
                    isMobile={isMobile}
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <main style={{
                    marginTop: '64px',
                    minHeight: 'calc(100vh - 64px)',
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        flex: 1,
                        padding: isMobile ? '16px' : '32px',
                        paddingBottom: 0
                    }}>
                        {children}
                    </div>
                    <div style={{ padding: isMobile ? '0 16px 20px' : '0 90px 24px 32px' }}>
                        <Footer isMobile={isMobile} />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
