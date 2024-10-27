import ProfileLayout from "@/components/profileLayout";
import { useState, useEffect } from "react";

export default function Profile() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const MIN_FULLNAME_LENGTH = 5;
    const MAX_FULLNAME_LENGTH = 255;
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
        setErrorMessage(""); // Limpa mensagens de erro ao entrar no modo de edição
    };

    const validateInputs = () => {
        if (!fullname.trim() || fullname.length < MIN_FULLNAME_LENGTH || fullname.length > MAX_FULLNAME_LENGTH) {
            setErrorMessage("Full name must be between 5 and 255 characters.");
            return false;
        }
        if (password && (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH)) {
            setErrorMessage("Password must be between 8 and 80 characters.");
            return false;
        }
        if (confirmPassword && (confirmPassword.length < MIN_PASSWORD_LENGTH || confirmPassword.length > MAX_PASSWORD_LENGTH)) {
            setErrorMessage("Confirm password must be between 8 and 80 characters.");
            return false;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return false;
        }
        setErrorMessage(""); // Limpa qualquer erro anterior se a validação passar
        return true;
    };

    const handleSave = async () => {
        if (!validateInputs()) return;

        const user = JSON.parse(sessionStorage.getItem("loggedUser"));
        if (user) {
            const updatedUser = {
                ...user,
                fullname,
                password: password || undefined,
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
                        setErrorMessage("Invalid data provided.");
                    } else if (response.status === 404) {
                        setErrorMessage("User not found.");
                    } else {
                        setErrorMessage("An error occurred. Please try again.");
                    }
                    return;
                }

                const updatedUserData = await response.json();
                sessionStorage.setItem("loggedUser", JSON.stringify(updatedUserData));
                setIsEditing(false);
                setErrorMessage("Profile updated successfully!"); // Mensagem de sucesso
            } catch (error) {
                console.error("Error updating profile:", error);
                setErrorMessage("An error occurred. Please try again.");
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
                        onChange={(e) => setFullname(e.target.value)}
                        disabled={!isEditing}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '8px',
                            border: `1px solid ${isEditing ? '#f65835' : '#ccc'}`,
                            borderRadius: '4px',
                            backgroundColor: isEditing ? '#fff' : '#f5f5f5',
                        }}
                    />
                    {errorMessage && <p style={{ color: 'red', fontSize: '14px' }}>{errorMessage}</p>}
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
                </div>
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
