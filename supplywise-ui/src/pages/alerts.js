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
            setNotifications((prev) => [newNotification, ...prev]);
        };

        return () => {
            socket.close();
        };
    }, []);

    const fetchNotifications = () => {
        const token = Cookies.get('access_token');
        const selectedRestaurantId = JSON.parse(sessionStorage.getItem('selectedRestaurant')).id;

        fetch(`${API_URL}/notifications/${selectedRestaurantId}`, {
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
                setNotifications(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching notifications:", error);
                setIsLoading(false);
            });
    };

    const markAllAsResolved = () => {
        const token = Cookies.get('access_token');
        const selectedRestaurantId = JSON.parse(sessionStorage.getItem('selectedRestaurant')).id;

        fetch(`${API_URL}/notifications/${selectedRestaurantId}/resolve`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to mark notifications as resolved");
                setNotifications([]);
            })
            .catch((error) => console.error("Error resolving notifications:", error));
    };

    return (
        <DashboardLayout>
            <div style={{ padding: '20px' }}>
                <h1 className="text-center">Notifications</h1>
                {isLoading ? (
                    <div className="text-center mt-5">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                    <div>
                        <button
                            className="btn btn-secondary mb-3"
                            onClick={markAllAsResolved}
                        >
                            Mark All as Resolved
                        </button>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Message</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.map((notification) => (
                                    <tr key={notification.id}>
                                        <td>{notification.message}</td>
                                        <td>{new Date(notification.createdAt).toLocaleString()}</td>
                                        <td>{notification.isResolved ? 'Resolved' : 'Unresolved'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center mt-5">No notifications available</div>
                )}
            </div>
        </DashboardLayout>
    );
}
