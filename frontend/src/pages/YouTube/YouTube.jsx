import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaYoutube,
    FaSearch,
    FaChevronDown
} from "react-icons/fa";

import DashboardLayout
    from "../../components/Layout/DashboardLayout";

import {
    searchYouTubeVideos
} from "../../services/youtubeService";

import "./YouTube.css";


const YouTube = () => {

    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    const [videos, setVideos] = useState([]);

    const [nextPageToken, setNextPageToken] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [searched, setSearched] =
        useState(false);


    // =======================================
    // SEARCH
    // =======================================

    const handleSearch = async (
        event,
        pageToken = null,
        append = false
    ) => {

        event?.preventDefault();

        if (!query.trim()) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await searchYouTubeVideos(
                    query,
                    10,
                    pageToken
                );


            const newVideos =
                response.data || [];


            setVideos((previous) =>
                append
                    ? [...previous, ...newVideos]
                    : newVideos
            );


            setNextPageToken(
                response.pagination
                    ?.nextPageToken || null
            );


            setSearched(true);

        } catch (error) {

            console.error(
                "YouTube search error:",
                error
            );

            setError(
                error.message ||
                "Failed to search YouTube"
            );

        } finally {

            setLoading(false);

        }
    };


    // =======================================
    // LOAD MORE
    // =======================================

    const handleLoadMore = () => {

        if (!nextPageToken || loading) {
            return;
        }

        handleSearch(
            null,
            nextPageToken,
            true
        );

    };


    return (

        <DashboardLayout>

            <div className="youtube-page">

                {/* =================================
                    HEADER
                ================================= */}

                <header className="youtube-header">

                    <div className="youtube-title">

                        <div className="youtube-icon">

                            <FaYoutube />

                        </div>

                        <div>

                            <h1>
                                YouTube Focus
                            </h1>

                            <p>
                                Learn without leaving
                                your productivity workspace.
                            </p>

                        </div>

                    </div>

                </header>


                {/* =================================
                    SEARCH
                ================================= */}

                <form
                    className="youtube-search"
                    onSubmit={handleSearch}
                >

                    <div className="youtube-search-box">

                        <FaSearch />

                        <input
                            type="text"
                            value={query}
                            onChange={(event) =>
                                setQuery(
                                    event.target.value
                                )
                            }
                            placeholder="Search lectures, tutorials, courses..."
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Searching..."
                            : "Search"
                        }

                    </button>

                </form>


                {/* =================================
                    QUICK SEARCHES
                ================================= */}

                <div className="youtube-quick-search">

                    <span>
                        Popular:
                    </span>

                    {[
                        "C++ DSA",
                        "Machine Learning",
                        "DBMS",
                        "Java",
                        "Web Development"
                    ].map((item) => (

                        <button
                            key={item}
                            type="button"
                            onClick={() => {

                                setQuery(item);

                                handleSearch(
                                    null,
                                    null,
                                    false
                                );

                            }}
                        >
                            {item}
                        </button>

                    ))}

                </div>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="youtube-error">
                        {error}
                    </div>

                )}


                {/* =================================
                    RESULTS HEADER
                ================================= */}

                {searched &&
                    videos.length > 0 && (

                    <div className="youtube-results-header">

                        <div>

                            <h2>
                                Search results
                            </h2>

                            <p>
                                {videos.length} videos
                                loaded
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================
                    VIDEO GRID
                ================================= */}

                <div className="youtube-grid">

                    {videos.map((video) => (

                        <article
                            className="youtube-card"
                            key={video.videoId}
                            onClick={() => {
                                if (video.videoId) {
                                    navigate(`/youtube/watch/${video.videoId}`);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    if (video.videoId) {
                                        navigate(`/youtube/watch/${video.videoId}`);
                                    }
                                }
                            }}
                        >

                            <div className="youtube-thumbnail">

                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                />

                                <div className="youtube-play">

                                    <FaYoutube />

                                </div>

                            </div>


                            <div className="youtube-card-body">

                                <h3>
                                    {video.title}
                                </h3>

                                <p className="youtube-channel">

                                    {video.channelTitle}

                                </p>

                                <p className="youtube-description">

                                    {video.description}

                                </p>

                            </div>

                        </article>

                    ))}

                </div>


                {/* =================================
                    LOAD MORE
                ================================= */}

                {nextPageToken && (

                    <div className="youtube-load-more">

                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                        >

                            {loading
                                ? "Loading..."
                                : "Load More"
                            }

                            <FaChevronDown />

                        </button>

                    </div>

                )}


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {!loading &&
                    videos.length === 0 && (

                    <div className="youtube-empty">

                        <FaYoutube />

                        <h2>
                            Find something to learn
                        </h2>

                        <p>
                            Search for lectures,
                            tutorials, courses,
                            and programming content.
                        </p>

                    </div>

                )}

            </div>

        </DashboardLayout>

    );

};


export default YouTube;