import React from 'react';
import styles from './Layout.module.css'; // You can keep using your CSS module

const Layout = ({ children }) => {
    return (
        <div className='container'>
            <div className={styles.logoBar}>
                <img className={styles.logo} src="/logo.png" alt="Logo" />
            </div>
            {children}
        </div>
    );
};

export default Layout;
