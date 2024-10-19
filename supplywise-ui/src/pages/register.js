import Head from 'next/head';
import { useState } from 'react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Dummy validation for registration
        if (username && email && password) {
            sessionStorage.setItem('user', JSON.stringify({ email }));
            window.location.href = '/dashboard';
        } else {
            alert('Please fill all the fields');
        }
    };

    return (
        <main>
            <Head>
                <title>Supplywise | Register</title>
                <meta name="description" content="Register in SupplyWise" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/Logo_Icon.png" />
            </Head>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <input
                                type="username"
                                className="form-control"
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn text-white border-0 sw-bgcolor w-100">Register</button>
                    </form>
                    <div className="mt-3 text-center">
                        <span className="sw-color forgot-password" onClick={() => window.location.href = '/login'}>
                            Already have an account? Sign In
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}
