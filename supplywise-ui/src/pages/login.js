import Head from 'next/head';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [forgotPassword, setForgotPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === 'supplywise24@gmail.com' && password === 'login123') {
            sessionStorage.setItem('user', JSON.stringify({ email }));
            window.location.href = '/management';
        } else {
            alert('Invalid email or password');
        }

    };

    return (
        <main>
            <Head>
                <title>Supplywise | Login</title>
                <meta name="description" content="Login in SupplyWise" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/Logo_Icon.png" />
            </Head>
            <div className="container d-flex justify-content-center align-items-center vh-100">
            {!forgotPassword ? (
                <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">Sign In</h2>
                    <form onSubmit={handleSubmit}>
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
                        <div className="form-group mb-4">
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
                        <button type="submit" className="btn text-white border-0 sw-bgcolor w-100">Login</button>
                    </form>
                    <div className="mt-3 text-center">
                        <span className="sw-color forgot-password" onClick={() => setForgotPassword(true)}>Forgot password?</span>
                    </div>
                </div>
            ) : (
                <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="btn text-white border-0 sw-bgcolor w-100">Submit</button>
                    </form>
                    <div className="mt-3 text-center">
                        <span className="sw-color forgot-password" onClick={() => setForgotPassword(false)}>Back to Login</span>
                    </div>
                </div>
            )}
        </div>
        </main>
    );
}
