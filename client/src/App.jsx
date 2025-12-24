import { useState } from 'react';
import Hero from './components/Hero';
import RoastForm from './components/RoastForm';
import RoastCard from './components/RoastCard';
import Loading from './components/Loading';
import './index.css';

const API_URL = 'http://localhost:3001/api';

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

  return (
    <div className="app">
      <Hero />

      {!roastData && !isLoading && !error && (
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

      {roastData && (
        <>
          <RoastCard data={roastData} />
          <button className="reset-btn" onClick={handleReset}>
            Roast Another
          </button>
        </>
      )}

      <footer className="footer">
        <a
          href="https://github.com/priya-singh27/uncleG"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          ⭐ Star on GitHub
        </a>
        <p>AI-generated roasts for entertainment only</p>
      </footer>
    </div>
  );
}

export default App;
