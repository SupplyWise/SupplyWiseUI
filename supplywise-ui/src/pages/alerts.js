import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/managementLayout";
import { API_URL } from '../../api_url';
import Cookies from 'js-cookie';

export default function Alerts() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFranchiseOwner, setIsFranchiseOwner] = useState(false);
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetchNotifications();

        const token = Cookies.get('access_token');
        const socket = new WebSocket(`${API_URL.replace('http', 'ws')}/ws/notifications?token=${token}`);

        socket.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);
            if (!newNotification.isResolved) {
                // Check if the new notification is already in the state to prevent duplicates
                setNotifications((prevNotifications) => {
                    if (!prevNotifications.some((n) => n.id === newNotification.id)) {
                        return [...prevNotifications, newNotification];
                    }
                    return prevNotifications;
                });
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            socket.close();
        };
    }, [notifications]);

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
            .then((data) => {
                setRestaurants(data);
                data.forEach((restaurant) => {
                    fetchNotificationsForRestaurant(restaurant.id, token);
                });
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
                setNotifications(
                    data.reverse().map((notification) => ({
                        ...notification,
                        isRead: notification.read,
                    }))
                );
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching notifications:", error);
                setIsLoading(false);
            });
    };

    const fetchNotificationsForRestaurant = (restaurantId, token) => {
        fetch(`${API_URL}/notifications/${restaurantId}`, {
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
                setNotifications((prevNotifications) => {
                    // Add new notifications if they don't exist already
                    const newNotifications = data.reverse().map((notification) => ({
                        ...notification,
                        isRead: notification.read,
                    }));

                    const combinedNotifications = [
                        ...prevNotifications,
                        ...newNotifications.filter(
                            (n) => !prevNotifications.some((prev) => prev.id === n.id)
                        ),
                    ];

                    return combinedNotifications;
                });
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching notifications for restaurant:", error);
            });
    };

    const markAsRead = (notificationId) => {
        const token = Cookies.get('access_token');

        fetch(`${API_URL}/notifications/${notificationId}/read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to mark notification as read");

                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                );
            })
            .catch((error) => console.error("Error marking notification as read:", error));
    };

    const markAsUnread = (notificationId) => {
        const token = Cookies.get('access_token');

        fetch(`${API_URL}/notifications/${notificationId}/unread`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to mark notification as unread");

                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notificationId ? { ...n, isRead: false } : n
                    )
                );
            })
            .catch((error) => console.error("Error marking notification as unread:", error));
    };

    return (
        <DashboardLayout>
            <div style={{ padding: '20px' }}>
                <h1 className="text-center">Notifications</h1>
                {isLoading ? (
                    <div className="text-center mt-5">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Message</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((notification) => (
                                <tr
                                    key={notification.id}
                                    style={{
                                        color: notification.isRead ? '#6c757d' : 'black',
                                        fontWeight: notification.isRead ? 'normal' : 'bold',
                                    }}
                                >
                                    <td>{notification.message}</td>
                                    <td>{new Date(notification.createdAt).toLocaleString()}</td>
                                    <td>
                                        {notification.isResolved
                                            ? 'Resolved'
                                            : notification.isRead
                                            ? 'Read'
                                            : 'Unread'}
                                    </td>
                                    <td>
                                        {!notification.isRead ? (
                                            <button
                                                className="btn btn-primary ms-2"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                Mark as Read
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-secondary ms-2"
                                                onClick={() => markAsUnread(notification.id)}
                                            >
                                                Mark as Unread
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center mt-5">No notifications available</div>
                )}
            </div>
        </DashboardLayout>
    );
}
