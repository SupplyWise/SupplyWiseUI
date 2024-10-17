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
            paddingBottom: '20px',
            paddingRight: '0px',
            boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
        }}>
            <div className=''>
                <div className='text-center bg-light'>
                    <Link className="navbar-brand text-black py-4 d-block" href="/">
                        <Image src="/Logo_Nav.png" alt="Supplywise" width={200} height={58} />
                    </Link>
                </div>
                {/* Nav Links */}
                <ul className="nav flex-column fs-4 fw-bold">
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

            {/* Alerts and Profile Section */}
            <div>
                <ul className="nav flex-column mb-4 fs-4">
                    <li className="nav-item">
                        <Link className="nav-link text-black d-flex align-items-center" href="/alerts">
                            {/*<FontAwesomeIcon icon={faBell} className="me-1" size='xs'/>*/}
                            Alerts
                        </Link>
                    </li>
                    <li className='nav-item d-flex align-items-center'>
                        <span className='text-black'>Profile</span>
                        <Link href="/logout" className=" text-black">
                            <FontAwesomeIcon icon={faSignOutAlt} className="me-1" size='xs'/>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
