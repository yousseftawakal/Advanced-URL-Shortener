import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';

const LoginForm = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Welcome Back</h2>
      <p className="auth-form__subtitle">
        Please enter your details to sign in
      </p>

      {error && <div className="auth-form__error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form__form">
        <div className="auth-form__group">
          <label htmlFor="identifier" className="auth-form__label">
            <FiUser className="auth-form__icon" />
            Username or Email
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            className="auth-form__input"
            required
            disabled={isLoading}
          />
        </div>

        <div className="auth-form__group">
          <label htmlFor="password" className="auth-form__label">
            <FiLock className="auth-form__icon" />
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="auth-form__input"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="auth-form__button"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="auth-form__footer">
        Don't have an account?{' '}
        <button
          onClick={onToggleForm}
          className="auth-form__link"
          disabled={isLoading}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
