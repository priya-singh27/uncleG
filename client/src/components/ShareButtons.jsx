import { useState } from 'react';

/**
 * ShareButtons Component
 * Twitter share and copy to clipboard functionality
 */
function ShareButtons({ username, roast }) {
    const [copied, setCopied] = useState(false);

    const shareText = `🔥 UncleG just roasted @${username}'s GitHub profile:\n\n"${roast.slice(0, 200)}${roast.length > 200 ? '...' : ''}"\n\nGet roasted: `;

    const handleTwitterShare = () => {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(tweetUrl, '_blank', 'width=550,height=420');
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
        <div className="share-buttons">
            <button
                className="share-buttons__btn share-buttons__btn--twitter"
                onClick={handleTwitterShare}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
            </button>

            <button
                className={`share-buttons__btn share-buttons__btn--copy ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
            >
                {copied ? (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy Roast
                    </>
                )}
            </button>
        </div>
    );
}

export default ShareButtons;
