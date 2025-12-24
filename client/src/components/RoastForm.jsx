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
            <div className="roast-form__field">
                <label className="roast-form__label">GitHub Username</label>
                <input
                    type="text"
                    className="roast-form__input"
                    placeholder="e.g. torvalds"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                    spellCheck="false"
                />
            </div>

            <button
                type="submit"
                className="roast-form__submit"
                disabled={isLoading || !username.trim()}
            >
                <span>🔥 Roast This Profile</span>
            </button>
        </form>
    );
}

export default RoastForm;
