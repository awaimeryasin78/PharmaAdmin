import Sidebar from './Sidebar'
import Topbar from './Topbar'

const Layout = ({ children, title }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ marginLeft: '240px', flex: 1 }}>
                <Topbar title={title} />
                <main style={{
                    marginTop: '64px',
                    padding: '32px',
                    minHeight: 'calc(100vh - 64px)'
                }}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout