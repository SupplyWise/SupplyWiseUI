
import DashboardLayout from "@/components/managementLayout";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { API_URL } from "../../../../api_url";
import Cookies from "js-cookie";
import ManagerCard from "@/components/managerCard";

export default function Team() {

    const team = [
        {
            id: 1,
            name: "John Doe",
            role: "manager",
            email: "some_email@ua.pt",
            restaurant: "9dbd7a1d-b31d-4cba-8326-2cd2aea93ba1",
        },
        {
            id: 2,
            name: "Mary Jane",
            role: "manager_master",
            email: "some_email@ua.pt",
            restaurant: "9dbd7a1d-b31d-4cba-8326-2cd2aea93ba1",
        },
    ]

    const [managers, setManagers] = useState(team);
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

    function deleteManager(id) {
        console.log('delete manager with id', id);
        setManagers(managers.filter(manager => manager.id !== id));
    }

    // add manager
    const [isAddingManager, setIsAddingManager] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('');
    const newUserRestaurantId = '9dbd7a1d-b31d-4cba-8326-2cd2aea93ba1';

    const openModalAddManager = () => {
        setIsAddingManager(true);
    }

    const addManager = async () => {
        if (newUserName === '' || newUserEmail === '' || newUserRole === '') {
            return;
        }
        
        if (newUserRole == 'manager') {
            try {
                const requestBody = {
                    username: newUserName,
                    email: newUserEmail,
                    company_id: sessionStorage.getItem('company') || null, // Replace with appropriate value or logic for `company_id`
                    restaurant_id: sessionStorage.getItem('selectedRestaurant') || null // Replace with appropriate value or logic for `restaurant_id`
                };
    
                const managerResponse = await fetch(`https://zo9bnne4ec.execute-api.eu-west-1.amazonaws.com/dev/user-management/create-manager`, {
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
        }
    
        setIsAddingManager(false);
        // TODO: add toast to show success
    };


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
