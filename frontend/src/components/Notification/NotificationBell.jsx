import { useEffect, useRef, useState } from "react";
import { FiBell, FiX, FiCheck, FiInbox } from "react-icons/fi";
import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../../services/notificationService";

import "./NotificationBell.css";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const notificationRef = useRef(null);


    // =======================================
    // FETCH NOTIFICATIONS
    // =======================================

    const fetchNotifications = async () => {

        try {

            setLoading(true);

            const response = await getNotifications();

            setNotifications(
                response.notifications || []
            );

        } catch (error) {

            console.error(
                "Notification Fetch Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =======================================
    // FETCH UNREAD COUNT
    // =======================================

    const fetchUnreadCount = async () => {

        try {

            const response = await getUnreadCount();

            setUnreadCount(
                Number(response.unreadCount) || 0
            );

        } catch (error) {

            console.error(
                "Unread Count Error:",
                error
            );

        }

    };


    // =======================================
    // INITIAL LOAD
    // =======================================

    useEffect(() => {

        fetchNotifications();
        fetchUnreadCount();

    }, []);


    // =======================================
    // CLOSE WHEN CLICKING OUTSIDE
    // =======================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {

                setIsOpen(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // =======================================
    // TOGGLE DROPDOWN
    // =======================================

    const handleToggle = async () => {

        const nextState = !isOpen;

        setIsOpen(nextState);

        if (nextState) {

            await fetchNotifications();
            await fetchUnreadCount();

        }

    };


    // =======================================
    // MARK ONE AS READ
    // =======================================

    const handleMarkAsRead = async (notification) => {

        if (notification.is_read) {
            return;
        }

        try {

            await markNotificationAsRead(
                notification.notification_id
            );

            setNotifications((previous) =>
                previous.map((item) =>
                    item.notification_id ===
                    notification.notification_id
                        ? {
                            ...item,
                            is_read: 1
                        }
                        : item
                )
            );

            setUnreadCount((previous) =>
                Math.max(previous - 1, 0)
            );

        } catch (error) {

            console.error(
                "Mark Notification Error:",
                error
            );

        }

    };


    // =======================================
    // MARK ALL AS READ
    // =======================================

    const handleMarkAllAsRead = async () => {

        if (unreadCount === 0) {
            return;
        }

        try {

            await markAllNotificationsAsRead();

            setNotifications((previous) =>
                previous.map((item) => ({
                    ...item,
                    is_read: 1
                }))
            );

            setUnreadCount(0);

        } catch (error) {

            console.error(
                "Mark All Notifications Error:",
                error
            );

        }

    };


    // =======================================
    // DELETE
    // =======================================

    const handleDelete = async (
        notificationId
    ) => {

        try {

            const notification =
                notifications.find(
                    (item) =>
                        item.notification_id ===
                        notificationId
                );

            await deleteNotification(
                notificationId
            );

            setNotifications((previous) =>
                previous.filter(
                    (item) =>
                        item.notification_id !==
                        notificationId
                )
            );

            if (
                notification &&
                !notification.is_read
            ) {

                setUnreadCount((previous) =>
                    Math.max(previous - 1, 0)
                );

            }

        } catch (error) {

            console.error(
                "Delete Notification Error:",
                error
            );

        }

    };


    // =======================================
    // FORMAT DATE
    // =======================================

    const formatNotificationDate = (date) => {

        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =======================================
    // RENDER
    // =======================================

    return (

        <div
            className="notification-container"
            ref={notificationRef}
        >

            {/* BELL */}

            <button
                type="button"
                className="notification-bell"
                onClick={handleToggle}
                aria-label="Notifications"
            >

                <FiBell className="notification-bell-icon" />

                {unreadCount > 0 && (

                    <span className="notification-badge">

                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}

                    </span>

                )}

            </button>


            {/* DROPDOWN */}

            {isOpen && (

                <div className="notification-dropdown">

                    {/* HEADER */}

                    <div className="notification-header">

                        <div>

                            <h3>
                                Notifications
                            </h3>

                            <span>
                                {unreadCount === 0 ? "All caught up" : `${unreadCount} unread`}
                            </span>

                        </div>


                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="mark-all-button"
                                onClick={
                                    handleMarkAllAsRead
                                }
                            >
                                <FiCheck /> Mark all read
                            </button>
                        )}

                    </div>


                    {/* CONTENT */}

                    <div className="notification-list">

                        {loading ? (

                            <div className="notification-empty">
                                <div className="notification-spinner" />
                                <p>Loading notifications...</p>
                            </div>

                        ) : notifications.length === 0 ? (

                            <div className="notification-empty">

                                <div className="empty-bell">
                                    <FiInbox />
                                </div>

                                <p>
                                    No notifications
                                </p>
                                <small>You are completely up to date.</small>

                            </div>

                        ) : (

                            notifications.map(
                                (notification) => (

                                    <div
                                        className={`notification-item ${
                                            notification.is_read
                                                ? "notification-read"
                                                : "notification-unread"
                                        }`}
                                        key={
                                            notification.notification_id
                                        }
                                    >

                                        <div
                                            className="notification-item-content"
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notification
                                                )
                                            }
                                        >

                                            <div className="notification-item-title">

                                                {!notification.is_read && (
                                                    <span className="notification-dot" />
                                                )}

                                                <strong>
                                                    {
                                                        notification.title
                                                    }
                                                </strong>

                                            </div>


                                            <p>
                                                {
                                                    notification.message
                                                }
                                            </p>


                                            <small>
                                                {
                                                    formatNotificationDate(
                                                        notification.created_at
                                                    )
                                                }
                                            </small>

                                        </div>


                                        <button
                                            type="button"
                                            className="notification-delete"
                                            onClick={() =>
                                                handleDelete(
                                                    notification.notification_id
                                                )
                                            }
                                            aria-label="Delete notification"
                                        >
                                            <FiX />
                                        </button>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}

export default NotificationBell;