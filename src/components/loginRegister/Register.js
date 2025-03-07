import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = ({ setAuth }) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
    });
    const {email, password, name} = inputs;
    const onChange = (e) => {
        setInputs({...inputs, [e.target.name] : e.target.value});
    }
    const onSubmitForm = async (e) => {
        e.preventDefault();

        try {
            const body = {email, password, name}
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)
            });
            const parseResponse = await response.json();

            if (parseResponse.token) {
                localStorage.setItem("token", parseResponse.token);
                setAuth(true);
                toast.success("Registered successfully!");
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
            <h1 className='text-center my-5'>Register</h1>
            <form onSubmit={onSubmitForm}>
                <input
                    type='email'
                    name='email'
                    placeholder='email'
                    className='form-control my-3'
                    value={email}
                    onChange={onChange}
                />
                <input
                    type='password'
                    name='password'
                    placeholder='password'
                    className='form-control my-3'
                    value={password}
                    onChange={onChange}
                />
                <input
                    type='text'
                    name='name'
                    placeholder='name'
                    className='form-control my-3'
                    value={name}
                    onChange={onChange}
                />
                <button className='btn btn-success btn-block'>Submit</button>
            </form>
            <Link to="/login">Login</Link>
        </Fragment>
    );
}

export default Register;
