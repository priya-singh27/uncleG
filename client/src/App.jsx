import { useState } from 'react';
import Hero from './components/Hero';
import RoastForm from './components/RoastForm';
import RoastCard from './components/RoastCard';
import Loading from './components/Loading';
import ExampleRoasts from './components/ExampleRoasts';
import './index.css';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

function App() {
  const [roastData, setRoastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoast = async (username) => {
    setIsLoading(true);
    setError(null);
    setRoastData(null);

    try {
      const response = await fetch(`${API_URL}/roast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roast');
      }

      setRoastData(data);
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Is the backend running?');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRoastData(null);
    setError(null);
  };

  // Roast result page layout
  if (roastData) {
    return (
      <div className="app app--roast-view">
        <nav className="navbar">
          <div className="navbar__logo">
            Uncle<span className="navbar__accent">G</span>
          </div>
          <div className="navbar__actions">
            <button className="navbar__btn" onClick={handleReset}>
              🔄 Roast Another
            </button>
            <a
              href="https://github.com/priya-singh27/uncleG"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__github"
            >
              <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </nav>

        <main className="main-content">
          <RoastCard data={roastData} />
        </main>

        <footer className="footer footer--minimal">
          <p>AI-generated roasts for entertainment only</p>
        </footer>
      </div>
    );
  }

  // Homepage layout - Side by side
  return (
    <div className="app app--home">
      <div className="home-layout">
        {/* LEFT: Example Roasts */}
        <div className="home-layout__examples">
          <ExampleRoasts />
        </div>

        {/* RIGHT: Hero + Form */}
        <div className="home-layout__main">
          <Hero compact={false} />

          {!isLoading && !error && (
            <RoastForm onSubmit={handleRoast} isLoading={isLoading} />
          )}

          {isLoading && <Loading />}

          {error && !isLoading && (
            <div className="error">
              <div className="error__title">Something went wrong</div>
              <div className="error__message">{error}</div>
              <button className="error__retry" onClick={handleReset}>
                Try Again
              </button>
            </div>
          )}

          <footer className="footer footer--inline">
            <a
              href="https://github.com/priya-singh27/uncleG"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Star on GitHub
            </a>
            <p>AI-generated roasts for entertainment only</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
