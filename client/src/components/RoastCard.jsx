import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, X as XIcon, Linkedin, MessageCircle, Facebook, Copy, Check } from 'lucide-react';
import ContributionGraph from './ContributionGraph';

function RoastCard({ data }) {
    const { username, roast, profile } = data;
    const cardRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);

        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 1,
                pixelRatio: 3,
                backgroundColor: '#09090b',
                skipFonts: true,
                style: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }
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

    const shareText = `🔥 UncleG just roasted my GitHub profile:\n\n"${roast.slice(0, 180)}${roast.length > 180 ? '...' : ''}"\n\nGet roasted:`;
    const shareUrl = 'https://uncle-g.vercel.app';

    const shareOptions = [
        { name: 'X (Twitter)', icon: XIcon, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
        { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
        { name: 'WhatsApp', icon: MessageCircle, url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
        { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}` },
    ];

    const handleShare = (url) => {
        window.open(url, '_blank', 'width=550,height=420');
        setShowShareMenu(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(roast);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="roast-card-wrapper">
            <div className="roast-card" id="roast-card" ref={cardRef}>
                {/* Action Icons - Top Right (hidden during download) */}
                {!isDownloading && (
                    <div className="roast-card__icons">
                        <button
                            className="icon-btn"
                            onClick={handleDownload}
                            title="Download"
                        >
                            <Download size={18} color='white' />
                        </button>
                        <div className="share-dropdown">
                            <button
                                className="icon-btn"
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                title="Share"
                            >
                                <Share2 size={18} color='white' />
                            </button>
                            {showShareMenu && (
                                <div className="share-menu">
                                    {shareOptions.map((opt) => (
                                        <button key={opt.name} onClick={() => handleShare(opt.url)}>
                                            <opt.icon size={16} color='white' /> {opt.name}
                                        </button>
                                    ))}
                                    <button onClick={handleCopy}>
                                        {copied ? <Check size={16} color='white' /> : <Copy size={16} color='white' />}
                                        {copied ? 'Copied!' : 'Copy text'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="roast-card__header">
                    <img src={profile.avatarUrl} alt={username} className="roast-card__avatar" crossOrigin="anonymous" />
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
                        <span className="mini-stat__value">{profile.totalContributions || profile.totalCommits || 0}</span>
                        <span className="mini-stat__label">Contributions</span>
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

                {/* Contribution Graph */}
                {profile.contributionWeeks && profile.contributionWeeks.length > 0 && (
                    <ContributionGraph weeks={profile.contributionWeeks} />
                )}

                {/* Roast Text */}
                <div className="roast-card__content">
                    {roast}
                </div>

                {/* Branding */}
                <div className="roast-card__branding">
                    🔥 roasted by <span style={{ color: 'var(--text-primary)' }}>Uncle</span><span className="hero__accent">G</span>
                </div>
            </div>
        </div>
    );
}

export default RoastCard;
