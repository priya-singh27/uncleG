import { useState } from 'react';

function RoastForm({ onSubmit, isLoading }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onSubmit(username.trim());
        }
    };

    return (
        <form className="roast-form" onSubmit={handleSubmit}>
            <label className="roast-form__label">
                GITHUB USERNAME
            </label>
            <input
                type="text"
                className="roast-form__input"
                placeholder="e.g. torvalds"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
            />
            <button
                type="submit"
                className="roast-form__submit"
                disabled={!username.trim() || isLoading}
            >
                🔥 Roast This Profile
            </button>
        </form>
    );
}

export default RoastForm;
