import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/managementLayout";
import { API_URL } from '../../api_url';
import Cookies from 'js-cookie';

export default function Alerts() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasRestaurant, setHasRestaurant] = useState(true);

    useEffect(() => {
        const selectedRestaurant = sessionStorage.getItem('selectedRestaurant');
        if (!selectedRestaurant) {
            setHasRestaurant(false);
            setIsLoading(false);
            return; // Exit early if no restaurant is selected
        }

        fetchNotifications();

        // WebSocket for real-time updates
        const socket = new WebSocket(`${API_URL.replace('http', 'ws')}/ws/notifications`);
        socket.onmessage = (event) => {
            const newNotification = JSON.parse(event.data);

            // Only add unresolved notifications
            if (!newNotification.isResolved) {
                setNotifications((prev) => [newNotification, ...prev]);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const fetchNotifications = () => {
        const token = Cookies.get('access_token');
        const selectedRestaurantId = JSON.parse(sessionStorage.getItem('selectedRestaurant')).id;

        fetch(`${API_URL}/notifications/${selectedRestaurantId}?includeResolved=false`, {
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

    const markAsResolved = (notificationId) => {
        const token = Cookies.get('access_token');

        fetch(`${API_URL}/notifications/${notificationId}/resolve`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to resolve notification");

                // Remove resolved notification from the state
                setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            })
            .catch((error) => console.error("Error resolving notification:", error));
    };

    return (
        <DashboardLayout>
            <div style={{ padding: '20px' }}>
                <h1 className="text-center">Notifications</h1>
                {!hasRestaurant ? (
                    <div className="text-center mt-5">
                        <h3>No restaurant selected</h3>
                        <p>Please select a restaurant to view notifications.</p>
                    </div>
                ) : isLoading ? (
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
                                <tr key={notification.id}>
                                    <td>{notification.message}</td>
                                    <td>{new Date(notification.createdAt).toLocaleString()}</td>
                                    <td>{notification.isResolved ? 'Resolved' : 'Unresolved'}</td>
                                    <td>
                                        {!notification.isResolved && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => markAsResolved(notification.id)}
                                            >
                                                Mark as Resolved
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
