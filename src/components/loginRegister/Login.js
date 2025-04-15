import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './index.module.css'

const Login = ({ setAuth, API, toggleForm }) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    const {email, password} = inputs;
    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value});
    }
    const onSubmitForm = async (e) => {
        e.preventDefault();

        try {
            const body = {email, password}
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)
            });
            const parseResponse = await response.json();

            if (parseResponse.token) {
                localStorage.setItem("token", parseResponse.token);
                setAuth(true);
                toast.success("Login successfully!");
            } else {
                setAuth(false);
                toast.error(parseResponse);
            }

        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <div className={styles.formbox}>
                <h1>Login</h1>
                <form onSubmit={onSubmitForm}>
                    <div className={styles.inputbox}>
                        <span className={styles.icon}><ion-icon name="mail-sharp"></ion-icon></span>
                        <input
                            type='email'
                            name='email'
                            value={email}
                            onChange={onChange}
                            required
                        />
                        <label>Email</label>
                    </div>
                    <div className={styles.inputbox}>
                        <span className={styles.icon}><ion-icon name="lock-closed-sharp"></ion-icon></span>
                        <input
                            type='password'
                            name='password'
                            value={password}
                            onChange={onChange}
                            required
                        />
                        <label>Password</label>
                    </div>
                    <button className={styles.btn}>Login</button>
                    <div className={styles.loginregister}>
                        <p>Don't have an account?
                            <button onClick={toggleForm} className={styles.link}>Register</button>
                        </p>
                    </div>
                </form>
            </div>
        </Fragment>
    );
}

export default Login;
