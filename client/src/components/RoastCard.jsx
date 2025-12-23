import ShareButtons from './ShareButtons';

function RoastCard({ data }) {
    const { username, roast, profile } = data;

    return (
        <div className="roast-card" id="roast-card">
            {/* Compact Header */}
            <div className="roast-card__header">
                <img
                    src={profile.avatarUrl}
                    alt={username}
                    className="roast-card__avatar"
                />
                <div className="roast-card__user-info">
                    <div className="roast-card__username">@{username}</div>
                    <div className="roast-card__mini-stats">
                        {profile.publicRepos} repos • {profile.followers} followers • {profile.totalStars}⭐
                    </div>
                </div>
            </div>

            {/* Compact Stats Row */}
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

            {/* Roast Text */}
            <div className="roast-card__content">
                {roast}
            </div>

            {/* Branding */}
            <div className="roast-card__branding">
                🔥 roasted by <strong>UncleG</strong>
            </div>

            {/* Share Buttons (hidden in screenshot) */}
            <ShareButtons username={username} roast={roast} />
        </div>
    );
}

export default RoastCard;
