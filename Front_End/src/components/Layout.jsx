import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
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
                    padding: isMobile ? '16px' : '32px',
                    minHeight: 'calc(100vh - 64px)',
                    boxSizing: 'border-box',
                    overflowX: 'hidden'
                }}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout
