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
                <label className="roast-form__label">GITHUB USERNAME</label>
                <input
                    type="text"
                    className="roast-form__input"
                    placeholder="Enter a GitHub username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                className="roast-form__submit"
                disabled={isLoading || !username.trim()}
            >
                Roast This
            </button>
        </form>
    );
}

export default RoastForm;
