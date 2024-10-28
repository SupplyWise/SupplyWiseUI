import ProfileLayout from "@/components/profileLayout";
import { useState, useEffect } from "react";
import { API_URL } from '../../../api_url';

export default function Profile() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [errorPassword, setErrorPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
    const [formMessage, setFormMessage] = useState("");

    const MIN_PASSWORD_LENGTH = 8;
    const MAX_PASSWORD_LENGTH = 80;

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("loggedUser"));
        if (user) {
            setFullname(user.fullname);
            setEmail(user.email);
            setPassword("");
        }
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        clearErrors();
    };

    const clearErrors = () => {
        setErrorPassword("");
        setErrorConfirmPassword("");
        setFormMessage("");
    };

    const validateInputs = () => {
        clearErrors();
        let isValid = true;

        if (!password || !confirmPassword) {
            setErrorPassword("Password is required.");
            setErrorConfirmPassword("Confirm password is required.");
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            setErrorConfirmPassword("Passwords do not match.");
            isValid = false;
        }

        if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
            setErrorPassword("Password must be between 8 and 80 characters.");
            isValid = false;
        }

        if (confirmPassword.length < MIN_PASSWORD_LENGTH || confirmPassword.length > MAX_PASSWORD_LENGTH) {
            setErrorConfirmPassword("Confirm password must be between 8 and 80 characters.");
            isValid = false;
        }

        return isValid;
    };

    const handleSave = async () => {
        if (!validateInputs()) return;
    
        const user = JSON.parse(sessionStorage.getItem("loggedUser"));
        if (user) {
            const updatedUser = {
                ...user,
                password: password
            };
    
            try {
                const response = await fetch(`${API_URL}/users/email/${email}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem("sessionToken")}`
                    },
                    body: JSON.stringify(updatedUser)
                });
    
                if (!response.ok) {
                    if (response.status === 400) {
                        setFormMessage("Invalid data provided.");
                    } else if (response.status === 404) {
                        setFormMessage("User not found.");
                    } else {
                        setFormMessage("An error occurred. Please try again.");
                    }
                    return;
                }
                
                // Check if there is a response to avoid parsing errors
                const updatedUserData = response.headers.get('Content-Length') !== '0' ? await response.json() : null;
                if (updatedUserData) {
                    sessionStorage.setItem("loggedUser", JSON.stringify(updatedUserData));
                }
    
                setIsEditing(false);
                setFormMessage("Profile updated successfully!");
            } catch (error) {
                console.error("Error updating profile:", error);
                setFormMessage("An error occurred. Please try again.");
            }
        }
    };
    

    return (
        <ProfileLayout>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Full Name</label>
                    <input
                        type="text"
                        value={fullname}
                        disabled
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '8px',
                            border: `1px solid '#ccc'`,
                            borderRadius: '4px',
                            backgroundColor: '#f5f5f5',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: '#f5f5f5',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: `1px solid ${isEditing ? '#f65835' : '#ccc'}`,
                            borderRadius: '4px',
                            backgroundColor: isEditing ? '#fff' : '#f5f5f5',
                        }}
                    />
                    {errorPassword && <p style={{ color: 'red', fontSize: '14px' }}>{errorPassword}</p>}
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 'bold' }}>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        placeholder="********"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: `1px solid ${isEditing ? '#f65835' : '#ccc'}`,
                            borderRadius: '4px',
                            backgroundColor: isEditing ? '#fff' : '#f5f5f5',
                        }}
                    />
                    {errorConfirmPassword && <p style={{ color: 'red', fontSize: '14px' }}>{errorConfirmPassword}</p>}
                </div>
                {formMessage && <p style={{ color: formMessage === "Profile updated successfully!" ? 'green' : 'red', fontSize: '14px', marginBottom: '20px' }}>{formMessage}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {!isEditing ? (
                        <button onClick={handleEdit} style={{ padding: '10px 20px', backgroundColor: '#f65835', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Edit
                        </button>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} style={{ padding: '10px 20px', backgroundColor: '#f65835', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                Save
                            </button>
                        </>
                    )}
                </div>
            </div>
        </ProfileLayout>
    );
}
