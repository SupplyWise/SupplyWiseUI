import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import SidebarNavLink from './sidebar/sidebarNavLink';
import { useState, useEffect } from 'react';

export default function Sidebar({ sessionUser }) {

    const pages = ["Dashboard", "Restaurants", "Settings"];
    const [currentPage, setCurrentPage] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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
        window.location.href = '/';
    }

    return (
        <nav className="col-2 bg-light vh-100 sw-bgcolor" style={{
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '4px 0px 5px rgba(0, 0, 0, 0.2)',
            overflowY: 'auto',
        }}>
            <div className='h-100'>
                <div className='text-center bg-light'>
                    <Link className="navbar-brand text-black py-4 d-block" href="/">
                        <Image src="/Logo_Nav.png" alt="Supplywise" width={200} height={58} />
                    </Link>
                </div>
                <div className='row'>
                    {/* Nav Links */}
                    <ul className="nav flex-column fs-4 fw-bold text-center p-0">
                        <hr className="my-0" />
                        {pages.map((page, index) => (
                            <SidebarNavLink key={index} text={page} currentPage={currentPage} selectedRestaurant={selectedRestaurant} />
                        ))}
                    </ul>
                </div>
            </div>

            {/* Alerts and Profile Section */}
            <div className='row' style={{ paddingLeft: "0px" }}>
                <div className='col-12' style={{ paddingLeft: "0px" }}>
                    <hr className='m-0'/>
                    <ul className="nav flex-column p-0 fs-4">
                        <li className="nav-item">
                            <div className='py-1' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <Link className="nav-link text-dark p-0" href="/alerts" style={{ display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faBell} style={{ width: '1.1vw', marginRight: '10px' }} />
                                    <span style={{fontSize: '1.1vw'}}>Alerts</span>
                                </Link>
                                {numAlertas > 0 && <span className="badge bg-danger rounded-pill" style={{fontSize: '1.1vw'}}>{numAlertas}</span>}
                            </div>
                        </li>
                        <hr className='m-0'/>
                        <li className='nav-item'>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ width: '1.5vw', marginRight: '10px' }} onClick={() => goToProfile()} />
                                    {
                                        sessionUser !== null &&
                                        <span>{sessionUser.fullname}</span>
                                    }
                                </div>
                                <FontAwesomeIcon icon={faSignOutAlt} style={{ width: '1.5vw', cursor: 'pointer' }} onClick={() => logout()} />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
