import { Fragment, useState } from "react";
import Login from "../components/loginRegister/Login";
import Register from "../components/loginRegister/Register";
import styles from './index.module.css';

function LoginRegister({ setAuth, API }) {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <Fragment>
            <div className={styles.container}>
                <header>
                    <img 
                        src="/logo.png" 
                        alt="Logo" 
                        className={styles.logo}
                    />
                </header>
                
                {isLogin ? (
                    <div className={styles.loginWrapper}>
                        <Login
                            setAuth={setAuth}
                            API={API}
                            toggleForm={() => setIsLogin(false)}
                        />
                    </div>
                ) : (
                    <div className={styles.registerWrapper}>
                        <Register
                            setAuth={setAuth}
                            API={API}
                            toggleForm={() => setIsLogin(true)}
                        />
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default LoginRegister;
