import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Link from 'next/link';


export default function Navbar() {
    useEffect(() => {

        var navbarShrink = function () {
            const navbarCollapsible = document.body.querySelector('#mainNav');
            if (!navbarCollapsible) {
                return;
            }
            navbarCollapsible.classList.add('navbar-shrink')

        };

        navbarShrink();
        document.addEventListener('scroll', navbarShrink);
    });

    useEffect(() => {
        // import bootstrap after the component is mounted
        import('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, []);

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        setCurrentPage(router.pathname);
    }, [router.pathname]);



    return (
        <nav className="navbar navbar-expand-lg bg-light fixed-top shadow" id="mainNav">
            <div className="container-fluid" style={{width: '90%'}}>
                <Link className="navbar-brand text-black" href="/">
                    SupplyWise
                </Link>
                <button className="navbar-toggler text-uppercase bg-secondary rounded" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto fs-5">
                        <li className="nav-item mx-0 mx-lg-1">
                            <Link className={`nav-link py-3 px-0 px-lg-3 rounded text-black`} href="/about">
                                Documetation
                            </Link>
                        </li>
                        <li className="nav-item mx-0 mx-lg-1">
                            <Link className={`nav-link py-3 px-0 px-lg-3 rounded-pill sw-bgcolor fs-4`} href="/login">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}