import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#0A1628',
                border: '0.5px solid #1E3A5F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(14,165,233,0.25), 0 4px 12px rgba(0,0,0,0.4)',
                zIndex: 1000
            }}
        >
            <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'dark' ? (
                    <Moon size={22} color='#0EA5E9' />
                ) : (
                    <Sun size={22} color='#F59E0B' />
                )}
            </motion.div>
        </motion.button>
    )
}

export default ThemeToggle