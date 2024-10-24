import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import SidebarNavLink from './sidebar/sidebarNavLink';
import { useState, useEffect } from 'react';

export default function Sidebar() {

    const pages = ["Dashboard", "Restaurants", "Settings"];
    const [currentPage, setCurrentPage] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const numAlertas = 11;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPage(window.location.pathname);
            setSelectedRestaurant(sessionStorage.getItem('selectedRestaurant'));
        }
    }, []);

    function logout() {
        window.location.href = '/';
    }

    return (
        <nav className="col-2 bg-light vh-100 sw-bgcolor" style={{
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingRight: '0px',
            boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
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
                        {pages.map((page, index) => (
                            <SidebarNavLink key={index} text={page} currentPage={currentPage} selectedRestaurant={selectedRestaurant} />
                        ))}
                    </ul>
                </div>
            </div>

            {/* Alerts and Profile Section */}
            <div className='row'>
                <div className='col-12' style={{ paddingLeft: 0 }}>
                    <ul className="nav flex-column p-0 fs-4" style={{ padding: "10px" }}>
                        <li className="nav-item">
                            <Link className="nav-link text-dark" href="/alerts">
                                Alerts
                                <FontAwesomeIcon icon={faBell} style={{ width: '1.5vw', padding: '0 0 5px 5px' }} />
                                {numAlertas > 0 && <span className="bell-alert bg-danger rounded-pill">{numAlertas}</span>}
                            </Link>
                        </li>
                        <li className='nav-item bg-dark text-white'>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ width: '1.5vw', marginRight: '10px' }} />
                                    <span>Admin Nice</span>
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
