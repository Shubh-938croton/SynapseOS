import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaYoutube } from "react-icons/fa";
import DashboardLayout from "../../components/Layout/DashboardLayout";

import "./YouTubeWatch.css";

const YouTubeWatch = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();

    if (!videoId) {
        return (
            <DashboardLayout>
                <div className="youtube-watch-error">
                    <FaYoutube />
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
                    <FaArrowLeft />
                    Back to YouTube
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
                        <FaYoutube />
                        <h1>Now Playing</h1>
                    </div>

                    <p>
                        You are watching this video inside
                        SynapseOS.
                    </p>

                    <div className="youtube-watch-actions">

                        <button>
                            Save Video
                        </button>

                        <button>
                            Focus Mode
                        </button>

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
};

export default YouTubeWatch;