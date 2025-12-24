import { useState, useEffect } from 'react';

const subtitles = [
    "He's seen every hype cycle.",
    "Unimpressed by your PRs.",
    "Your code's harshest critic.",
    "Reading docs since '99."
];

function Hero({ compact = false }) {
    const [text, setText] = useState('');
    const [subtitleIndex, setSubtitleIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (compact) return; // No animation in compact mode

        const currentSubtitle = subtitles[subtitleIndex];

        if (isTyping) {
            if (text.length < currentSubtitle.length) {
                const timer = setTimeout(() => {
                    setText(currentSubtitle.slice(0, text.length + 1));
                }, 40);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => setIsTyping(false), 3000);
                return () => clearTimeout(timer);
            }
        } else {
            if (text.length > 0) {
                const timer = setTimeout(() => {
                    setText(text.slice(0, -1));
                }, 20);
                return () => clearTimeout(timer);
            } else {
                setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
                setIsTyping(true);
            }
        }
    }, [text, isTyping, subtitleIndex, compact]);

    return (
        <section className={`hero ${compact ? 'hero--compact' : ''}`}>
            <h1 className="hero__title">Uncle<span className="hero__accent">G</span></h1>
            {compact ? (
                <p className="hero__subtitle"></p>
            ) : (
                <p className="hero__subtitle">
                    {text}<span className="hero__cursor">|</span>
                </p>
            )}
        </section>
    );
}

export default Hero;
