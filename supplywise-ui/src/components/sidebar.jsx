import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import SidebarNavLink from './sidebar/sidebarNavLink';
import { useState, useEffect } from 'react';

import Cookies from 'js-cookie';

export default function Sidebar() {

    const pages = ["Dashboard", "Restaurants", "Settings"];
    const [currentPage, setCurrentPage] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [username, setUsername] = useState(null);

    const numAlertas = 11;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPage(window.location.pathname);
            if (sessionStorage.getItem('selectedRestaurant')) {
                setSelectedRestaurant(JSON.parse(sessionStorage.getItem('selectedRestaurant')).name);
            }
        }
    }, []);

    function goToProfile() {
        if (!sessionUser || sessionUser === null) {
            alert('You must be logged in to access your profile.');
            return
        }
        window.location.href = '/profile/user';
    }

    function logout() {
        sessionStorage.clear();
        window.location.href = 'https://eu-west-1cqv0ahnls.auth.eu-west-1.amazoncognito.com/logout?client_id=3p7arovt4ql7qasmbjg52u1qas&logout_uri=http://localhost:3000';
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPage(window.location.pathname);
            if (sessionStorage.getItem('selectedRestaurant')) {
                setSelectedRestaurant(JSON.parse(sessionStorage.getItem('selectedRestaurant')).name);
            }
            setUsername(Cookies.get('username'));
        }
    }, []);

    return (
        <nav className="col-2 bg-light vh-100 sw-bgcolor" style={{
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingRight: '0px',
            boxShadow: '4px 0px 5px rgba(0, 0, 0, 0.2)',
        }}>
            <div className='h-100'>
                <div className='text-center bg-light'>
                    <Link className="navbar-brand text-black py-4 d-block" href="/">
                        <Image src="/Logo_Nav.png" alt="Supplywise" width={200} height={58} />
                    </Link>
                </div>
                <div className='row'>
                    {/* Nav Links */}
                    <ul className="nav flex-column fs-4 fw-bold text-center">
                        <hr className="my-0" />
                        {pages.map((page, index) => (
                            <SidebarNavLink key={index} text={page} currentPage={currentPage} selectedRestaurant={selectedRestaurant} />
                        ))}
                    </ul>
                </div>
            </div>
            
            {/* Alerts and Profile Section */}
            <div className='row' style={{paddingLeft: "0px"}}>
                <div className='col-12' style={{paddingLeft: "0px"}}>
                    <hr/>
                    <ul className="nav flex-column p-0 fs-4" style={{ padding: "10px" }}>
                        <li className="nav-item">
                        </li>
                        <li className='nav-item'>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                                    <FontAwesomeIcon icon={faUser} style={{ width: '1.5vw', marginRight: '10px' }} onClick={() => goToProfile()}/>
                                    <span>{username}</span>
                                </div>
                                <Link className="nav-link text-dark pr-1" href="/alerts" style={{ paddingRight: "3px", paddingBottom: "16px"}}>
                                    {numAlertas > 0 && <span className="bell-alert bg-danger rounded-pill">{numAlertas}</span>}
                                    <FontAwesomeIcon icon={faBell} style={{ width: '1.5vw', padding: '0 0 -5px 10px' }} />
                                </Link>
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ width: '1.5vw', cursor: 'pointer' }} onClick={() => logout()} />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
