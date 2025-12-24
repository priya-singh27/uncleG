import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useTypewriter } from '../hooks/useTypewriter';
import ShareButtons from './ShareButtons';

function RoastCard({ data }) {
    const { username, roast, profile } = data;
    const cardRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Typing animation for roast text
    const { displayedText, isComplete } = useTypewriter(roast, 15);

    const handleDownload = async () => {
        if (!cardRef.current) return;

        setIsDownloading(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 3,
                backgroundColor: '#09090b',
                skipFonts: true, // Skip font embedding to avoid errors
                style: {
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }
            });

            const link = document.createElement('a');
            link.download = `uncleg-roast-${username}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Failed to download:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="roast-card-wrapper">
            {/* Downloadable Card Area */}
            <div className="roast-card" id="roast-card" ref={cardRef}>
                <div className="roast-card__header">
                    <img
                        src={profile.avatarUrl}
                        alt={username}
                        className="roast-card__avatar"
                        crossOrigin="anonymous"
                    />
                    <div className="roast-card__user-info">
                        <div className="roast-card__username">@{username}</div>
                        <div className="roast-card__mini-stats">
                            {profile.publicRepos} repos • {profile.followers} followers • {profile.totalStars}⭐
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="roast-card__stats-row">
                    <div className="mini-stat">
                        <span className="mini-stat__value">{profile.universalRank}</span>
                        <span className="mini-stat__label">Rank</span>
                    </div>
                    <div className="mini-stat">
                        <span className="mini-stat__value">{profile.longestStreak}d</span>
                        <span className="mini-stat__label">Streak</span>
                    </div>
                    <div className="mini-stat">
                        <span className="mini-stat__value">{profile.totalCommits}</span>
                        <span className="mini-stat__label">Commits</span>
                    </div>
                    <div className="mini-stat">
                        <span className="mini-stat__value">{profile.topLanguage}</span>
                        <span className="mini-stat__label">Language</span>
                    </div>
                    <div className="mini-stat">
                        <span className="mini-stat__value">{profile.powerLevel}</span>
                        <span className="mini-stat__label">Level</span>
                    </div>
                </div>

                {/* Roast Text with Typing Animation */}
                <div className="roast-card__content">
                    {displayedText}
                    {!isComplete && <span className="typing-cursor">|</span>}
                </div>

                {/* Branding */}
                <div className="roast-card__branding">
                    🔥 roasted by <strong>UncleG</strong>
                </div>
            </div>

            {/* Actions (outside screenshot area) */}
            <div className="roast-card__actions">
                <button
                    className="download-btn"
                    onClick={handleDownload}
                    disabled={isDownloading || !isComplete}
                >
                    {isDownloading ? 'Downloading...' : '📥 Download Image'}
                </button>
                <ShareButtons username={username} roast={roast} />
            </div>
        </div>
    );
}

export default RoastCard;
