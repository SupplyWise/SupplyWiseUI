import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import SidebarNavLink from './sidebar/sidebarNavLink';
import { useState, useEffect } from 'react';
import { API_URL } from '/api_url';
import Cookies from 'js-cookie';

export default function Sidebar() {

    const pages = ["Dashboard", "Restaurants", "Settings"];
    const [currentPage, setCurrentPage] = useState('');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [username, setUsername] = useState(null);
    const [numAlertas, setNumAlertas] = useState(0);
    const [isFranchiseOwner, setIsFranchiseOwner] = useState(false);

    useEffect(() => {
        fetchNotifications();

        // WebSocket for real-time updates
        const token = Cookies.get('access_token');
        const socket = new WebSocket(`${API_URL.replace('http', 'ws')}/ws/notifications?token=${token}`);

        socket.onmessage = (event) => {
            fetchNotifications();
        };

        return () => {
            socket.close();
        };
    }, []);

    const fetchNotifications = () => {
        const token = Cookies.get('access_token');

        fetch(`${API_URL}/auth/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch user roles');
                return response.text();
            })
            .then((roles) => {
                const isOwner = roles.includes('ROLE_FRANCHISE_OWNER');
                setIsFranchiseOwner(isOwner);
                console.log(roles);

                if (isOwner) {
                    fetchRestaurantsAndNotifications(token);
                } else {
                    fetchNotificationsForSingleRestaurant(token);
                }
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
            });
    };

    const fetchRestaurantsAndNotifications = (token) => {
        fetch(`${API_URL}/restaurants/company`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch restaurants');
                return response.json();
            })
            .then((restaurants) => {
                const notificationPromises = restaurants.map((restaurant) =>
                    fetchNotificationsForRestaurant(restaurant.id, token)
                );

                Promise.all(notificationPromises)
                    .then((notificationsArray) => {
                        const allNotifications = notificationsArray.flat(); // Combine all notifications into a single array
                        setNotificationsAndAlertCount(allNotifications);
                    })
                    .catch((error) => console.error('Error fetching restaurant notifications:', error));
            })
            .catch((error) => console.error('Error fetching restaurants:', error));
    };

    const fetchNotificationsForSingleRestaurant = (token) => {
        fetch(`${API_URL}/notifications`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch notifications");
                return response.json();
            })
            .then((data) => {
                setNotificationsAndAlertCount(data);
            })
            .catch((error) => {
                console.error("Error fetching notifications:", error);
            });
    };

    const fetchNotificationsForRestaurant = (restaurantId, token) => {
        return fetch(`${API_URL}/notifications/${restaurantId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch notifications");
                return response.json();
            })
            .catch((error) => {
                console.error(`Error fetching notifications for restaurant ${restaurantId}:`, error);
                return []; // Return an empty array if there's an error for a specific restaurant
            });
    };

    const setNotificationsAndAlertCount = (notificationsData) => {
        const unreadNotifications = notificationsData.filter(notification => !notification.read);
        setNumAlertas(unreadNotifications.length);
    };

    function goToProfile() {
        if (!sessionUser || sessionUser === null) {
            alert('You must be logged in to access your profile.');
            return;
        }
        window.location.href = '/profile/user';
    }

    function logout() {
        sessionStorage.clear();
        window.location.href = 'https://eu-west-1cqv0ahnls.auth.eu-west-1.amazoncognito.com/logout?client_id=3p7arovt4ql7qasmbjg52u1qas&logout_uri=https://d245iwoa00k2r.cloudfront.net';
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
        <nav
            className="col-2 bg-light vh-100"
            style={{
                backgroundColor: '#f8f9fa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '4px 0px 5px rgba(0, 0, 0, 0.2)',
            }}
        >
            <div className="h-100">
                {/* Logo */}
                <div className="text-center bg-light">
                    <Link className="navbar-brand text-black py-4 d-block" href="/">
                        <Image src="/Logo_Nav.png" alt="Supplywise" width={200} height={58} />
                    </Link>
                </div>
                <div className='row'>
                    {/* Nav Links */}
                    <ul className="nav flex-column fs-4 fw-bold text-center p-0">
                        <hr className="my-0" />
                        {pages.map((page, index) => (
                            <SidebarNavLink
                                key={index}
                                text={page}
                                currentPage={currentPage}
                                selectedRestaurant={selectedRestaurant}
                            />
                        ))}
                    </ul>
                </div>
            </div>
    
            {/* Notifications and Profile Section */}
            <div className="row" style={{ padding: '0px' }}>
                <div className="col-12" style={{ padding: '0px' }}>
                    <hr className="my-0" />
    
                    {/* Notifications */}
                    <div
                        className="d-flex align-items-center justify-content-start p-3"
                        style={{
                            fontSize: '1.1em', // Match the font size of username
                            fontWeight: 'bold', // Keep bold for consistency
                        }}
                    >
                        <FontAwesomeIcon icon={faBell} style={{ width: '1.5vw', marginRight: '10px' }} />
                        <Link href="/alerts" className="text-dark text-decoration-none">
                            Notifications
                        </Link>
                        {numAlertas > 0 && (
                            <span
                                className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center"
                                style={{
                                    width: '1.5em',
                                    height: '1.5em',
                                    fontSize: '0.9em',
                                    marginLeft: '10px',
                                }}
                            >
                                {numAlertas}
                            </span>
                        )}
                    </div>
                    <hr className="my-0" />
    
                    {/* Username and Logout */}
                    <ul className="nav flex-column fs-4 p-0" style={{ padding: '10px' }}>
                        <li className="nav-item">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 10,
                                }}
                            >
                            {/* Username */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        style={{ width: '1.5vw', marginRight: '10px' }}
                                    />
                                    <span>{username}</span>
                                </div>
    
                                {/* Logout */}
                                <FontAwesomeIcon
                                    icon={faSignOutAlt}
                                    className='button-link'
                                    style={{ width: '1.5vw', cursor: 'pointer' }}
                                    onClick={() => logout()}
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
