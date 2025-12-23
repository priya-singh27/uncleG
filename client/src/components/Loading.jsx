import { useState, useEffect } from 'react';

/**
 * Loading Component
 * Shows spinner with rotating fun messages
 */
const LOADING_MESSAGES = [
    "UncleG is analyzing your profile...",
    "Judging your commit messages...",
    "Counting your abandoned side projects...",
    "Reviewing your README.md files...",
    "Calculating your actual productivity...",
    "Finding your worst code decisions...",
    "Loading brutal honesty...",
];

function Loading() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading">
            <div className="loading__spinner"></div>
            <div className="loading__text">{LOADING_MESSAGES[messageIndex]}</div>
            <div className="loading__subtext">Preparing some brutally honest feedback 🔥</div>
        </div>
    );
}

export default Loading;
