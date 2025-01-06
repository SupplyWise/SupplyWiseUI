
import DashboardLayout from "@/components/managementLayout";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { API_URL } from "../../../../api_url";
import Cookies from "js-cookie";
import ManagerCard from "@/components/managerCard";

export default function Team() {

    const [userRoles, setUserRoles] = useState([]);

    // Fetch user role from session or context
    useEffect(() => {
        const token = Cookies.get('access_token');
        fetch(`${API_URL}/auth/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the access token
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user roles');
                }
                return response.text();
            })
            .then((data) => {
                const rolesList = data.replace(/[\[\]']+/g, '').split(',').map(role => role.trim().replace('ROLE_', ''));
                setUserRoles(rolesList);
            })
            .catch((error) => {
                console.error("Error fetching company details:", error.message);
            });
    }, []);

    // Fetch managers only when userRoles is updated
    useEffect(() => {
        if (userRoles.length > 0) { // Ensure userRoles is populated
            getManagers();
        }
    }, [userRoles]); // Trigger when userRoles changes

    const [managers, setManagers] = useState([]);
    const [textFilter, setTextFilter] = useState('');

    function getRoleName(role) {
        switch (role) {
            case "manager":
                return "Manager";
            case "manager_master":
                return "Manager Master";
            default:
                return "Unknown";
        }
    }

    // add manager
    const [isAddingManager, setIsAddingManager] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('');

    const openModalAddManager = () => {
        setIsAddingManager(true);
    }

    const addManager = async () => {
        if (newUserName === '' || newUserEmail === '' || newUserRole === '') {
            return;
        }
        
        try {
            const requestBody = {
                username: newUserName,
                email: newUserEmail,
                user_role: newUserRole,
                company_id: sessionStorage.getItem('company') || null,
                restaurant_id: JSON.parse(sessionStorage.getItem('selectedRestaurant'))?.id || null
            };

            console.log('Request body:', requestBody);

            const managerResponse = await fetch(`https://mamajuc0i9.execute-api.eu-west-1.amazonaws.com/api/user-management/create-manager`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access_token')}` // Replace `authToken` with your authentication token variable
                },
                body: JSON.stringify(requestBody)
            });

            if (!managerResponse.ok) {
                throw new Error('Failed to create manager');
            }

            const responseData = await managerResponse.json();
            console.log('Manager created successfully:', responseData);

        } catch (error) {
            console.error('Error creating manager:', error);
        }

        setIsAddingManager(false);
        getManagers();
        // TODO: add toast to show success
    };

    const getManagers = async () => {
        try {
            let url = 'https://mamajuc0i9.execute-api.eu-west-1.amazonaws.com/api/user-management/get-managers';
            if (userRoles.includes('ADMIN') || userRoles.includes('FRANCHISE_OWNER')) {
                const restaurantId = JSON.parse(sessionStorage.getItem("selectedRestaurant")).id;
                url += `?restaurant_id=${restaurantId}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access_token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch managers');
            }

            const responseData = await response.json();
            console.log('Managers fetched successfully:', responseData);

            setManagers(responseData.users);

        } catch (error) {
            console.error('Error fetching managers:', error);
        }
    }

    const deleteManager = async (username) => {
        try {
            const response = await fetch(`https://mamajuc0i9.execute-api.eu-west-1.amazonaws.com/api/user-management/delete-manager?target_username=${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access_token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete manager');
            }

            console.log('Manager deleted successfully');
            setManagers(managers.filter(manager => manager.name !== username));

        } catch (error) {
            console.error('Error deleting manager:', error);
        }
    }

    const roles = ["manager", "manager_master"];

    return (
        <DashboardLayout>
            <div style={{ padding: '20px' }}>
                <div className="content">
                    <div className='mt-3 row'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <input type="text" style={{ borderRadius: '5px', border: '1px solid black', padding: '5px' }} placeholder="Search by name" onChange={(e) => setTextFilter(e.target.value)} />
                            <button onClick={openModalAddManager} className='btn sw-bgcolor'>Add Manager</button>
                        </div>
                    </div>
                    <div className="row">
                        {managers
                            ?.filter(manager => textFilter === '' || manager.name.toLowerCase().includes(textFilter.toLowerCase()))
                            .map(manager => (
                                <ManagerCard
                                    key={manager.id}
                                    id={manager.id}
                                    name={manager.name}
                                    role={manager.role}
                                    restaurant={manager.restaurant}
                                    email={manager.email}
                                    getRoleName={getRoleName}
                                    deleteManager={deleteManager}
                                />
                            ))}
                    </div>
                </div>
            </div>
            {
                isAddingManager && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Manager</h5>
                                    <button type="button" className="btn-close" onClick={() => setIsAddingManager(false)} aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-5">
                                    <form>
                                        <div className="row mb-3">
                                            <label htmlFor="newUserName" className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="newUserName"
                                                value={newUserName}
                                                onChange={(e) => setNewUserName(e.target.value)}
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="newUserEmail" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="newUserEmail"
                                                value={newUserEmail}
                                                onChange={(e) => setNewUserEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="newUserRole" className="form-label">Role</label>
                                            <select
                                                className="form-select"
                                                id="newUserRole"
                                                value={newUserRole}
                                                onChange={(e) => setNewUserRole(e.target.value)}
                                            >
                                                <option value="">Select Role</option>
                                                {roles.map(role => (
                                                    <option key={role} value={role}>{getRoleName(role)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsAddingManager(false)}>Close</button>
                                    <button
                                        type="button"
                                        className="btn sw-bgcolor"
                                        disabled={newUserName === '' || newUserEmail === '' || newUserRole === ''}
                                        onClick={() => addManager()}
                                    >
                                        Add Manager
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </DashboardLayout>

    );
}
