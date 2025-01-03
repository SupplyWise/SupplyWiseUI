import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/managementLayout";
import { API_URL } from '../../api_url';
import Cookies from 'js-cookie';

export default function Alerts() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();

        // WebSocket for real-time updates
        const socket = new WebSocket(`${API_URL.replace('http', 'ws')}/ws/notifications`);
        socket.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);
            if (!newNotification.isResolved) {
                fetchNotifications();
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const fetchNotifications = () => {
        const token = Cookies.get('access_token');

        fetch(`${API_URL}/notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch notifications");
                return response.json();
            })
            .then((data) => {
                // Reverse the order to show older notifications above newer ones
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
                                        color: notification.isRead ? '#6c757d' : 'black',  // Lighter text for read notifications
                                        fontWeight: notification.isRead ? 'normal' : 'bold',  // Bold text for unread notifications
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
                                        {!notification.isRead && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                Mark as Read
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
