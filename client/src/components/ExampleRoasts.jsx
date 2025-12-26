import { useState, useEffect } from 'react';

const images = [
    '/uncleg-roast-torvalds.webp',
    '/uncleg-roast-yyx990803.webp',
    '/uncleg-roast-ry.webp'
];

function ExampleRoasts() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
                setIsVisible(true);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="example-roasts">
            <p className="example-roasts__label">Featured Roasts</p>
            <div className={`example-roasts__image-container ${isVisible ? 'visible' : ''}`}>
                <img
                    src={images[currentIndex]}
                    alt="Example roast card"
                    className="example-roasts__image"
                />
            </div>
            <div className="example-roasts__dots">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`example-roasts__dot ${i === currentIndex ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ExampleRoasts;
