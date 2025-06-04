import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';

const SignupForm = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData);
    } catch (err) {
      // Handle validation errors from the server
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.data?.error) {
        // Handle mongoose validation errors
        const validationError = err.response.data.error;
        if (typeof validationError === 'object') {
          const errorMessages = Object.values(validationError).join(', ');
          toast.error(errorMessages);
        } else {
          toast.error(validationError);
        }
      } else {
        toast.error('Failed to sign up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Create Account</h2>
      <p className="auth-form__subtitle">
        Please fill in your details to sign up
      </p>

      <form onSubmit={handleSubmit} className="auth-form__form">
        <div className="auth-form__group">
          <label htmlFor="name" className="auth-form__label">
            <FiUser className="auth-form__icon" />
            Full Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="auth-form__input"
            maxLength="50"
            disabled={isLoading}
          />
        </div>

        <div className="auth-form__group">
          <label htmlFor="username" className="auth-form__label">
            <FiUser className="auth-form__icon" />
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="auth-form__input"
            required
            maxLength="50"
            pattern="^(?!\.)(?!.*\.$)[a-zA-Z0-9_.]+$"
            title="Username can only contain letters, numbers, underscores, and dots. Cannot start or end with a dot."
            disabled={isLoading}
          />
        </div>

        <div className="auth-form__group">
          <label htmlFor="email" className="auth-form__label">
            <FiMail className="auth-form__icon" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
            minLength="8"
            disabled={isLoading}
          />
        </div>

        <div className="auth-form__group">
          <label htmlFor="passwordConfirm" className="auth-form__label">
            <FiLock className="auth-form__icon" />
            Confirm Password
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="auth-form__input"
            required
            minLength="8"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="auth-form__button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="auth-form__footer">
        Already have an account?{' '}
        <button
          onClick={onToggleForm}
          className="auth-form__link"
          disabled={isLoading}
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default SignupForm;
