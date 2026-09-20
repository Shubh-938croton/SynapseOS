import { useEffect, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
    FiUser,
    FiMail,
    FiAtSign,
    FiCalendar,
    FiEdit2,
    FiKey,
    FiLock,
    FiCheck,
    FiX,
    FiAlertCircle,
    FiCheckCircle
} from "react-icons/fi";
import {
    getUserProfile,
    updateUserProfile,
    changePassword
} from "../../services/profileService";
import "./Profile.css";


function Profile() {

    // =======================================
    // PROFILE STATES
    // =======================================

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");


    // =======================================
    // EDIT PROFILE STATES
    // =======================================

    const [editing, setEditing] = useState(false);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: ""
    });


    // =======================================
    // CHANGE PASSWORD STATES
    // =======================================

    const [changingPassword, setChangingPassword] =
        useState(false);

    const [passwordSaving, setPasswordSaving] =
        useState(false);

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });


    // =======================================
    // FETCH PROFILE
    // =======================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await getUserProfile();

                setProfile(response.profile);

                setFormData({
                    full_name:
                        response.profile.full_name || "",

                    username:
                        response.profile.username || "",

                    email:
                        response.profile.email || ""
                });

            } catch (err) {

                console.error(
                    "Profile Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load profile"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    // =======================================
    // HANDLE PROFILE INPUT
    // =======================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    // =======================================
    // HANDLE PASSWORD INPUT
    // =======================================

    const handlePasswordChange = (event) => {

        const { name, value } = event.target;

        setPasswordData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    // =======================================
    // EDIT PROFILE
    // =======================================

    const handleEdit = () => {

        setError("");

        setSuccessMessage("");

        setFormData({
            full_name:
                profile?.full_name || "",

            username:
                profile?.username || "",

            email:
                profile?.email || ""
        });

        setEditing(true);

    };


    // =======================================
    // CANCEL EDIT
    // =======================================

    const handleCancel = () => {

        setError("");

        setSuccessMessage("");

        setFormData({
            full_name:
                profile?.full_name || "",

            username:
                profile?.username || "",

            email:
                profile?.email || ""
        });

        setEditing(false);

    };


    // =======================================
    // SAVE PROFILE
    // =======================================

    const handleSave = async (event) => {

        event.preventDefault();

        setSaving(true);

        setError("");

        setSuccessMessage("");

        try {

            const response =
                await updateUserProfile(formData);


            setProfile((previousProfile) => ({
                ...previousProfile,
                ...formData
            }));


            // Update localStorage
            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {

                const user =
                    JSON.parse(storedUser);

                const updatedUser = {
                    ...user,
                    ...formData
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );

            }


            setEditing(false);

            setSuccessMessage(
                response.message ||
                "Profile updated successfully"
            );

        } catch (err) {

            console.error(
                "Update Profile Error:",
                err
            );

            setError(
                err.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // =======================================
    // ENABLE CHANGE PASSWORD
    // =======================================

    const handleChangePasswordClick = () => {

        setEditing(false);

        setError("");

        setSuccessMessage("");

        setPasswordData({
            current_password: "",
            new_password: "",
            confirm_password: ""
        });

        setChangingPassword(true);

    };


    // =======================================
    // CANCEL CHANGE PASSWORD
    // =======================================

    const handleCancelPassword = () => {

        setError("");

        setSuccessMessage("");

        setPasswordData({
            current_password: "",
            new_password: "",
            confirm_password: ""
        });

        setChangingPassword(false);

    };


    // =======================================
    // CHANGE PASSWORD
    // =======================================

    const handlePasswordSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccessMessage("");


        // Check new password
        if (
            passwordData.new_password.length < 8
        ) {

            setError(
                "New password must be at least 8 characters long."
            );

            return;

        }


        // Check password confirmation
        if (
            passwordData.new_password !==
            passwordData.confirm_password
        ) {

            setError(
                "New password and confirm password do not match."
            );

            return;

        }


        // Prevent same password
        if (
            passwordData.current_password ===
            passwordData.new_password
        ) {

            setError(
                "New password must be different from your current password."
            );

            return;

        }


        setPasswordSaving(true);


        try {

            const response =
                await changePassword({

                    current_password:
                        passwordData.current_password,

                    new_password:
                        passwordData.new_password

                });


            setPasswordData({
                current_password: "",
                new_password: "",
                confirm_password: ""
            });


            setChangingPassword(false);


            setSuccessMessage(
                response.message ||
                "Password changed successfully."
            );


        } catch (err) {

            console.error(
                "Change Password Error:",
                err
            );

            setError(
                err.message ||
                "Failed to change password."
            );

        } finally {

            setPasswordSaving(false);

        }

    };


    // =======================================
    // LOADING
    // =======================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="profile-state">

                    <div className="profile-spinner"></div>

                    <p>
                        Loading profile...
                    </p>

                </div>

            </DashboardLayout>

        );

    }


    // =======================================
    // PROFILE NOT FOUND
    // =======================================

    if (!profile) {

        return (

            <DashboardLayout>

                <div className="profile-state">

                    <h2>
                        Unable to load profile
                    </h2>

                    <p>
                        {error || "Profile not found"}
                    </p>

                </div>

            </DashboardLayout>

        );

    }


    // =======================================
    // PROFILE DATA
    // =======================================

    const fullName =
        profile.full_name || "User";

    const username =
        profile.username || "username";

    const email =
        profile.email || "No email";

    const createdAt =
        profile.created_at;


    // =======================================
    // FORMAT DATE
    // =======================================

    const formatDate = (date) => {

        if (!date) {
            return "Unknown";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return date;

        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    };


    // =======================================
    // AVATAR
    // =======================================

    const avatarLetter =
        fullName.charAt(0).toUpperCase();


    // =======================================
    // PAGE
    // =======================================

    return (

        <DashboardLayout>

            <div className="profile-page">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="profile-header">

                    <span className="profile-eyebrow">
                        ACCOUNT
                    </span>

                    <h1>
                        Profile
                    </h1>

                    <p>
                        Manage your personal information
                        and account details.
                    </p>

                </div>


                {/* =================================
                    SUCCESS MESSAGE
                ================================= */}

                {successMessage && (

                    <div className="profile-success-message">
                        <FiCheckCircle className="profile-msg-icon" />
                        <span>{successMessage}</span>
                    </div>

                )}


                {/* =================================
                    ERROR MESSAGE
                ================================= */}

                {error && (

                    <div className="profile-error-message">
                        <FiAlertCircle className="profile-msg-icon" />
                        <span>{error}</span>
                    </div>

                )}


                {/* =================================
                    PROFILE CARD
                ================================= */}

                <section className="profile-card">


                    {/* =================================
                        NORMAL PROFILE
                    ================================= */}

                    {!editing && !changingPassword && (

                        <>

                            <div className="profile-card-top">

                                <div className="profile-avatar">

                                    {avatarLetter}

                                </div>


                                <div className="profile-main-info">

                                    <h2>
                                        {fullName}
                                    </h2>

                                    <p>
                                        @{username}
                                    </p>

                                    <span>
                                        {email}
                                    </span>

                                </div>

                            </div>


                            <div className="profile-section">

                                <h3>
                                    Account Information
                                </h3>


                                <div className="profile-info-grid">


                                    <div className="profile-info-item">

                                        <span className="profile-item-label">
                                            <FiUser /> Full Name
                                        </span>

                                        <strong>
                                            {fullName}
                                        </strong>

                                    </div>


                                    <div className="profile-info-item">

                                        <span className="profile-item-label">
                                            <FiAtSign /> Username
                                        </span>

                                        <strong>
                                            @{username}
                                        </strong>

                                    </div>


                                    <div className="profile-info-item">

                                        <span className="profile-item-label">
                                            <FiMail /> Email
                                        </span>

                                        <strong>
                                            {email}
                                        </strong>

                                    </div>


                                    <div className="profile-info-item">

                                        <span className="profile-item-label">
                                            <FiCalendar /> Member Since
                                        </span>

                                        <strong>
                                            {formatDate(createdAt)}
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="profile-actions">

                                <button
                                    className="profile-edit-btn"
                                    type="button"
                                    onClick={handleEdit}
                                >
                                    <FiEdit2 />
                                    Edit Profile
                                </button>


                                <button
                                    className="profile-password-btn"
                                    type="button"
                                    onClick={
                                        handleChangePasswordClick
                                    }
                                >
                                    <FiKey />
                                    Change Password
                                </button>

                            </div>

                        </>

                    )}


                    {/* =================================
                        EDIT PROFILE
                    ================================= */}

                    {editing && (

                        <form
                            className="profile-edit-form"
                            onSubmit={handleSave}
                        >

                            <div className="profile-edit-header">

                                <div>

                                    <h2>
                                        Edit Profile
                                    </h2>

                                    <p>
                                        Update your account information.
                                    </p>

                                </div>

                            </div>


                            {/* FULL NAME */}

                            <div className="profile-form-group">

                                <label htmlFor="full_name">
                                    Full Name
                                </label>

                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* USERNAME */}

                            <div className="profile-form-group">

                                <label htmlFor="username">
                                    Username
                                </label>

                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="profile-form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* ACTIONS */}

                            <div className="profile-actions">

                                <button
                                    className="profile-edit-btn"
                                    type="submit"
                                    disabled={saving}
                                >
                                    <FiCheck />
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>


                                <button
                                    className="profile-password-btn"
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    <FiX />
                                    Cancel
                                </button>

                            </div>

                        </form>

                    )}


                    {/* =================================
                        CHANGE PASSWORD
                    ================================= */}

                    {changingPassword && (

                        <form
                            className="profile-edit-form"
                            onSubmit={handlePasswordSubmit}
                        >

                            <div className="profile-edit-header">

                                <div>

                                    <h2>
                                        Change Password
                                    </h2>

                                    <p>
                                        Update your password
                                        to keep your account secure.
                                    </p>

                                </div>

                            </div>


                            {/* CURRENT PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="current_password">

                                    Current Password

                                </label>

                                <input
                                    id="current_password"
                                    name="current_password"
                                    type="password"
                                    value={
                                        passwordData.current_password
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    autoComplete="current-password"
                                    required
                                />

                            </div>


                            {/* NEW PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="new_password">

                                    New Password

                                </label>

                                <input
                                    id="new_password"
                                    name="new_password"
                                    type="password"
                                    value={
                                        passwordData.new_password
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />

                                <small className="profile-input-hint">

                                    Minimum 8 characters.

                                </small>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="profile-form-group">

                                <label htmlFor="confirm_password">

                                    Confirm New Password

                                </label>

                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type="password"
                                    value={
                                        passwordData.confirm_password
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />

                            </div>


                            {/* ACTIONS */}

                            <div className="profile-actions">

                                <button
                                    className="profile-edit-btn"
                                    type="submit"
                                    disabled={passwordSaving}
                                >
                                    <FiLock />
                                    {passwordSaving
                                        ? "Changing..."
                                        : "Change Password"}

                                </button>


                                <button
                                    className="profile-password-btn"
                                    type="button"
                                    onClick={
                                        handleCancelPassword
                                    }
                                    disabled={passwordSaving}
                                >
                                    <FiX />
                                    Cancel

                                </button>

                            </div>

                        </form>

                    )}

                </section>

            </div>

        </DashboardLayout>

    );

}


export default Profile;