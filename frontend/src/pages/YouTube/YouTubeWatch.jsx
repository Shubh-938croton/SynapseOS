import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiPlay, FiBookmark, FiVideo } from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";

import "./YouTubeWatch.css";

const YouTubeWatch = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();

    if (!videoId) {
        return (
            <DashboardLayout>
                <div className="youtube-watch-error">
                    <div className="watch-error-icon">
                        <FiVideo />
                    </div>
                    <h2>Video not found</h2>
                    <button onClick={() => navigate("/youtube")}>
                        Back to YouTube
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="youtube-watch-page">
                <button
                    className="youtube-back-button"
                    onClick={() => navigate("/youtube")}
                >
                    <FiArrowLeft />
                    <span>Back to YouTube Hub</span>
                </button>

                <div className="youtube-player-container">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>

                <div className="youtube-watch-info">
                    <div className="youtube-watch-title">
                        <div className="watch-title-icon">
                            <FiPlay />
                        </div>
                        <div>
                            <h1>Active Study Stream</h1>
                            <p>Distraction-free viewer embedded in your workspace.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default YouTubeWatch;