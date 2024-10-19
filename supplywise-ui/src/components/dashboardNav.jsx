import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
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
                <div className='row h-100'>
                    <div className='col-1 bg-dark'></div>
                    <div className='col-11'>
                        {/* Nav Links */}
                        <ul className="nav flex-column fs-4 fw-bold text-center">
                            <li className="nav-item sw-bgcolor px-2">
                                <Link className="nav-link text-white" href="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item sw-bgcolor px-2">
                                <Link className="nav-link text-white" href="/restaurants">
                                    Restaurants
                                </Link>
                            </li>
                            <li className="nav-item sw-bgcolor px-2">
                                <Link className="nav-link text-white" href="/settings">
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Alerts and Profile Section */}
            <div>
                <ul className="nav flex-column mb-4 fs-4 bg-light" style={{paddingBottom: "20px"}}>
                    <li className="nav-item">
                        <Link className="nav-link text-black" href="/alerts">
                            {/*<FontAwesomeIcon icon={faBell} className="me-1" size='xs'/>*/}
                            Alerts
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <span className='text-black'>John Doe</span>
                        <Link href="/logout" className="nav-link text-black">
                            <FontAwesomeIcon icon={faSignOutAlt} style={{ width: '16px', height: '16px' }}/>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
