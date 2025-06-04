import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { links } from '../services/api';

function Redirect() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const redirectToLongUrl = async () => {
      if (hasRedirected.current) return;
      hasRedirected.current = true;

      try {
        const response = await links.goTo(shortCode);
        if (response.data?.data?.url) {
          window.location.href = response.data.data.url;
        } else {
          setError('Invalid URL response from server');
        }
      } catch (err) {
        console.error('Error redirecting:', err);
        if (err.response?.status === 429) {
          setError('Too many requests. Please try again in a moment.');
        } else if (err.code === 'ERR_NETWORK') {
          setError(
            'Network error. Please check your connection and try again.'
          );
        } else {
          setError('Error redirecting to URL');
        }
      }
    };

    redirectToLongUrl();
  }, [shortCode]);

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="redirect-container">
      <h1>Redirecting...</h1>
      <p>Please wait while we redirect you to your destination.</p>
    </div>
  );
}

export default Redirect;
