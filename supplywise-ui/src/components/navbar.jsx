import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Link from 'next/link';


export default function Navbar() {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        setCurrentPage(router.pathname);
    }, [router.pathname]);



    return (
        <nav className="navbar navbar-expand-lg bg-light fixed-top shadow" id="mainNav">
            <div className="container-fluid" style={{ width: '90%' }}>
                <Link className="navbar-brand text-black" href="/">
                    <Image src="/Logo_Nav.png" alt="Supplywise" width={175} height={50} />
                </Link>
                <button className="navbar-toggler text-uppercase sw-button text-white rounded" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto fs-5">
                        <li className="nav-item mx-0 mx-lg-1">
                            <Link className={`nav-link py-3 px-0 px-lg-3 rounded text-black`} href="/about">
                                Documentation
                            </Link>
                        </li>
                        <li className="nav-item mx-0 mx-lg-1">
                            <Link href="https://eu-west-1cqv0ahnls.auth.eu-west-1.amazoncognito.com/signup?client_id=3p7arovt4ql7qasmbjg52u1qas&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=email+openid+phone" className="register-button nav-link py-3 px-0 px-lg-3 rounded-pill fs-5 fw-bold">
                                Register
                            </Link>
                        </li>
                        <li className="nav-item mx-0 mx-lg-1">
                            <Link href="https://eu-west-1cqv0ahnls.auth.eu-west-1.amazoncognito.com/login?client_id=3p7arovt4ql7qasmbjg52u1qas&redirect_uri=http://localhost:3000/login&response_type=code&scope=email+openid+phone" className={`login-button nav-link py-3 px-0 px-lg-3 rounded-pill text fs-5 fw-bold`}>
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}