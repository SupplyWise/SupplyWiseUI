import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../../api_url';

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [forgotPassword, setForgotPassword] = useState(false);

    const handleLogin = () => {
        document.getElementById('login-error').classList.add('visually-hidden');
        try {
            fetch(`${API_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(response.statusText || 'HTTP error, status = ' + response.status);
                    }
                    return response.json();
                })
                .then((data) => {
                    sessionStorage.setItem('sessionToken', data.token);
                    router.push('/management');
                })
                .catch((error) => {
                    console.error(error);
                    const loginError = document.getElementById('login-error');
                    loginError.classList.remove('visually-hidden');
                });


        } catch (error) {
            console.error(error);
            const loginError = document.getElementById('login-error');
            loginError.classList.remove('visually-hidden');
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
                        <form>
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
                            <div id="login-error" className='visually-hidden text-danger'>
                                &nbsp;
                                <span>Invalid credentials</span>
                            </div>
                            <button type="button" onClick={handleLogin} className="btn text-white border-0 sw-bgcolor w-100">Login</button>
                        </form>
                        <div className="mt-3 text-center">
                            <span className="sw-color forgot-password" onClick={() => setForgotPassword(true)}>Forgot password?</span>
                        </div>
                    </div>
                ) : (
                    <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                        <h2 className="text-center mb-4">Forgot Password</h2>
                        <form onSubmit={handleLogin}>
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
                        <div className="mt-3 mb-2 text-center">
                            <span className="sw-color forgot-password" onClick={() => setForgotPassword(false)}>Back to Login</span>
                        </div>
                        <p className="text-center mt-5">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-black sw-color fw-bold">
                                Register
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
