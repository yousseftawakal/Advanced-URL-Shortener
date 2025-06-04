import React, { useState, useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import './styles/main.scss';
import logoLight from './assets/CortoX - White.png';
import logoDark from './assets/CortoX - Purple.png';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { links, user } from './services/api';
import Redirect from './components/Redirect';
import QRCodePopup from './components/QRCodePopup';
import AuthPage from './components/auth/AuthPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  FiSearch,
  FiLink,
  FiBarChart,
  FiDownload,
  FiCopy,
  FiTrash2,
  FiEdit2,
  FiSettings,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { FaQrcode } from 'react-icons/fa';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/auth');
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
        <p className="loading__text">Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/');
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
        <p className="loading__text">Loading...</p>
      </div>
    );
  }

  if (currentUser) {
    return null;
  }

  return children;
};

function AppContent() {
  const [cortos, setCortos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setCortos(currentUser.links || []);
      setIsLoading(false);
    } else if (!authLoading) {
      setCortos([]);
      setIsLoading(false);
    }
  }, [currentUser, authLoading]);

  const handleSubmit = async (formData) => {
    try {
      const response = await links.create(formData);
      if (response.data?.data?.link) {
        setCortos((prev) => [response.data.data.link, ...prev]);
        toast.success('Corto created!');
        return response;
      }
    } catch (error) {
      console.error('Error creating link:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to create link. Please try again.');
      }
      throw error;
    }
  };

  const handleUpdate = async (shortCode, formData) => {
    try {
      const response = await links.update(shortCode, formData);
      if (response.data?.data?.link) {
        setCortos((prev) =>
          prev.map((corto) =>
            corto.shortCode === shortCode ? response.data.data.link : corto
          )
        );
        toast.success('Corto updated!');
        return response;
      }
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  };

  const handleDelete = async (shortCode) => {
    try {
      await links.delete(shortCode);
      setCortos((prev) =>
        prev.filter((corto) => corto.shortCode !== shortCode)
      );
      toast.success('Corto deleted!');
    } catch (error) {
      console.error('Error deleting corto:', error);
    }
  };

  const handleCopy = async (shortCode) => {
    try {
      const port = window.location.port ? `:${window.location.port}` : '';
      await navigator.clipboard.writeText(
        `${window.location.protocol}//${window.location.hostname}${port}/${shortCode}`
      );
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  };

  const handleExport = async () => {
    if (cortos.length === 0) return;

    try {
      const headers = [
        'Title',
        'Short URL',
        'Long URL',
        'Created',
        'Updated',
        'Clicks',
      ];
      const csvContent = [
        headers.join(','),
        ...cortos.map((corto) =>
          [
            `"${corto.title}"`,
            `"${corto.shortCode}"`,
            `"${corto.longUrl}"`,
            `"${corto.created}"`,
            `"${corto.updated}"`,
            corto.clicks,
          ].join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `CortoX - ${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const totalCortos = cortos.length;
  const totalClicks = cortos.reduce((sum, corto) => sum + corto.accessCount, 0);
  const avgClicksPerCorto =
    totalCortos > 0 ? Math.round(totalClicks / totalCortos) : 0;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="app">
                <Header />
                <main className="main">
                  <div className="main__container">
                    <div className="main__content">
                      <div className="greeting">
                        <h1 className="greeting__title">
                          Hello,{' '}
                          {currentUser?.name || currentUser?.username || '_'}
                        </h1>
                        <p className="greeting__subtitle">
                          Welcome to your dashboard
                        </p>
                      </div>
                      <StatsCards
                        totalCortos={totalCortos || 0}
                        totalClicks={totalClicks || 0}
                        avgClicksPerCorto={avgClicksPerCorto || 0}
                      />
                      <CreateCorto onSubmit={handleSubmit} error={error} />
                      <YourCortos
                        cortos={cortos}
                        handleDelete={handleDelete}
                        handleCopy={handleCopy}
                        handleExport={handleExport}
                        handleUpdate={handleUpdate}
                      />
                    </div>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route path="/:shortCode" element={<Redirect />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { currentUser, logout } = useAuth();

  const getInitials = (name, username) => {
    if (name) {
      const nameParts = name.trim().split(' ');
      if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
      return `${nameParts[0][0]}${
        nameParts[nameParts.length - 1][0]
      }`.toUpperCase();
    }
    // If no name, use first letter of username
    return username ? username[0].toUpperCase() : '_';
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSettings = () => {
    setIsSettingsOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-container">
          <img
            src={theme === 'dark' ? logoLight : logoDark}
            alt="Corto Logo"
            className="header__logo"
          />
        </div>
        <div className="header__user">
          <div className="header__profile" onClick={handleMenuToggle}>
            <div className="header__avatar">
              {getInitials(currentUser?.name, currentUser?.username)}
            </div>
          </div>
          {isMenuOpen && (
            <div className="header__menu">
              <button className="header__menu-item" onClick={handleSettings}>
                <FiSettings className="header__menu-icon" />
                Settings
              </button>
              <button className="header__menu-item" onClick={handleLogout}>
                <FiLogOut className="header__menu-icon" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {isSettingsOpen && (
        <SettingsPopup
          onClose={() => setIsSettingsOpen(false)}
          userData={currentUser}
        />
      )}
    </header>
  );
};

const SettingsPopup = ({ onClose, userData }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, setCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    theme: theme,
    name: userData?.name || '',
    username: userData?.username || '',
    email: userData?.email || '',
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, theme }));
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'theme') {
      toggleTheme(value);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setIsProfileLoading(true);

    let response;
    try {
      response = await user.updateMe({
        name: formData.name,
        username: formData.username,
        email: formData.email,
      });
    } catch (err) {
      if (err.response?.data?.message) {
        setProfileError(err.response.data.message);
      } else if (err.response?.data?.error) {
        const validationError = err.response.data.error;
        if (typeof validationError === 'object') {
          const errorMessages = Object.values(validationError).join(', ');
          setProfileError(errorMessages);
        } else {
          setProfileError(validationError);
        }
      } else {
        setProfileError('Failed to update profile. Please try again.');
      }
      setIsProfileLoading(false);
      return;
    }

    setCurrentUser(response.data.data.user);
    toast.success('Profile updated!');
    setIsProfileLoading(false);
    onClose();
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (formData.password !== formData.passwordConfirm) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsPasswordLoading(true);

    try {
      await user.updatePassword({
        passwordCurrent: formData.passwordCurrent,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });

      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        passwordCurrent: '',
        password: '',
        passwordConfirm: '',
      }));
      toast.success('Password updated!');
    } catch (err) {
      if (err.response?.data?.message) {
        setPasswordError(err.response.data.message);
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="settings-popup">
      <div className="settings-popup__overlay" onClick={onClose} />
      <div className="settings-popup__content">
        <div className="settings-popup__header">
          <h2 className="settings-popup__title">Settings</h2>
          <button className="settings-popup__close" onClick={onClose}>
            <FiX className="settings-popup__close-icon" />
          </button>
        </div>
        <div className="settings-popup__body">
          <div className="settings-popup__section">
            <h3 className="settings-popup__section-title">Theme</h3>
            <div className="settings-popup__option">
              <label className="settings-popup__label">Appearance</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="settings-popup__select"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          <form
            className="settings-popup__section"
            onSubmit={handleProfileSubmit}
          >
            <h3 className="settings-popup__section-title">Profile</h3>
            {profileError && (
              <div className="settings-popup__error">{profileError}</div>
            )}
            <div className="settings-popup__option">
              <label className="settings-popup__label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="settings-popup__input"
                maxLength={50}
              />
            </div>
            <div className="settings-popup__option">
              <label className="settings-popup__label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="settings-popup__input"
                maxLength={50}
                pattern="^(?!\.)(?!.*\.$)[a-zA-Z0-9_.]+$"
                title="Username can only contain letters, numbers, underscores, and dots. Cannot start or end with a dot."
              />
            </div>
            <div className="settings-popup__option">
              <label className="settings-popup__label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="settings-popup__input"
              />
            </div>
            <div className="settings-popup__section-footer">
              <button
                type="submit"
                className="settings-popup__button settings-popup__button--save"
                disabled={isProfileLoading}
              >
                {isProfileLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          <form
            className="settings-popup__section"
            onSubmit={handlePasswordSubmit}
          >
            <h3 className="settings-popup__section-title">Password</h3>
            {passwordError && (
              <div className="settings-popup__error">{passwordError}</div>
            )}
            <div className="settings-popup__option">
              <label className="settings-popup__label">Current Password</label>
              <input
                type="password"
                name="passwordCurrent"
                value={formData.passwordCurrent}
                onChange={handleChange}
                className="settings-popup__input"
                required
              />
            </div>
            <div className="settings-popup__option">
              <label className="settings-popup__label">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="settings-popup__input"
                required
                minLength={8}
              />
            </div>
            <div className="settings-popup__option">
              <label className="settings-popup__label">
                Confirm New Password
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="settings-popup__input"
                required
                minLength={8}
              />
            </div>
            <div className="settings-popup__section-footer">
              <button
                type="submit"
                className="settings-popup__button settings-popup__button--save"
                disabled={isPasswordLoading}
              >
                {isPasswordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>

          <div className="settings-popup__footer">
            <button
              type="button"
              className="settings-popup__button settings-popup__button--cancel"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatsCards({ totalCortos, totalClicks, avgClicksPerCorto }) {
  return (
    <div className="stats-cards">
      <div className="stats-card">
        <div className="stats-card__header">
          <h3 className="stats-card__title">Total Cortos</h3>
          <FiLink className="stats-card__icon stats-card__icon--link" />
        </div>
        <div className="stats-card__value">{totalCortos}</div>
      </div>

      <div className="stats-card">
        <div className="stats-card__header">
          <h3 className="stats-card__title">Total Clicks</h3>
          <FiBarChart className="stats-card__icon stats-card__icon--clicks" />
        </div>
        <div className="stats-card__value">{totalClicks}</div>
      </div>

      <div className="stats-card">
        <div className="stats-card__header">
          <h3 className="stats-card__title">Avg. Clicks/Corto</h3>
          <FiBarChart className="stats-card__icon stats-card__icon--stats" />
        </div>
        <div className="stats-card__value">{avgClicksPerCorto}</div>
      </div>
    </div>
  );
}

function CreateCorto({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    shortCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      // Only clear the form if submission was successful
      setFormData({
        title: '',
        url: '',
        shortCode: '',
      });
    } catch (error) {
      // Keep the form data if there was an error
      console.error('Error creating link:', error.message);
    }
  };

  return (
    <div className="create-corto">
      <div className="create-corto__header">
        <h2 className="create-corto__title">Create New Corto</h2>
      </div>

      <form className="create-corto__form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Long URL</label>
          <div className="input-with-icon">
            <FiLink className="input-icon" />
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="form-control"
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group form-group--large">
            <label className="form-label">Title (Optional)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="My awesome corto"
            />
            <small className="form-hint">Give your link a memorable name</small>
          </div>

          <div className="form-group">
            <label className="form-label">Custom Alias (Optional)</label>
            <div className="input-with-prefix">
              <span className="input-prefix">cortox.io/</span>
              <input
                type="text"
                name="shortCode"
                value={formData.shortCode}
                onChange={handleChange}
                className="form-control"
                placeholder="my-custom-corto"
              />
            </div>
            <small className="form-hint">
              Leave blank to generate a random short URL
            </small>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn btn--primary btn--create">
          Create Corto
        </button>
      </form>
    </div>
  );
}

function YourCortos({
  cortos,
  handleDelete,
  handleCopy,
  handleExport,
  handleUpdate,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredCortos = cortos.filter(
    (corto) =>
      corto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corto.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCortos.length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCortos = filteredCortos.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="your-cortos">
      <div className="your-cortos__header">
        <div>
          <h2 className="your-cortos__title">Your Cortos</h2>
          <p className="your-cortos__subtitle">
            Manage and track your shortened URLs
          </p>
        </div>
        <div className="your-cortos__actions">
          <div className="your-cortos__search">
            <div className="search-box">
              <FiSearch className="search-box__icon" />
              <input
                type="text"
                className="search-box__input"
                placeholder="Search your cortos..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <button
            className="btn btn--secondary"
            onClick={handleExport}
            disabled={cortos.length === 0}
            title={
              cortos.length === 0
                ? 'No data to export'
                : 'Export your cortos data'
            }
          >
            <FiDownload className="btn__icon" />
            Export Data
          </button>
        </div>
      </div>

      <div className="your-cortos__table-container">
        {filteredCortos.length === 0 ? (
          <div className="empty-state">
            <FiLink className="empty-state__icon" />
            <p className="empty-state__message">
              {searchTerm
                ? 'No cortos found matching your search'
                : 'No cortos yet. Create your first one to get started!'}
            </p>
          </div>
        ) : (
          <>
            <table className="your-cortos__table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Corto</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Clicks</th>
                  <th className="your-cortos__actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCortos.map((corto) => (
                  <CortoRow
                    key={corto.shortCode}
                    corto={corto}
                    onDelete={(shortCode) => handleDelete(shortCode)}
                    onCopy={(shortCode) => handleCopy(shortCode)}
                    onUpdate={handleUpdate}
                  />
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination__btn pagination__btn--prev"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <IoChevronBackOutline className="pagination__icon" />
                  Previous
                </button>

                <div className="pagination__pages">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination__page ${
                        currentPage === index + 1
                          ? 'pagination__page--active'
                          : ''
                      }`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination__btn pagination__btn--next"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <IoChevronForwardOutline className="pagination__icon" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CortoRow({ corto, onDelete, onCopy, onUpdate }) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBaseUrl = () => {
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${window.location.hostname}${port}`;
  };

  return (
    <tr>
      <td>{corto.title}</td>
      <td className="your-cortos__corto-column">
        <a
          href={`${window.location.protocol}//${getBaseUrl()}/${
            corto.shortCode
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {`${getBaseUrl()}/${corto.shortCode}`}
        </a>
      </td>
      <td>{formatDate(corto.createdAt)}</td>
      <td>{corto.updatedAt ? formatDate(corto.updatedAt) : 'N/A'}</td>
      <td>{corto.accessCount}</td>
      <td>
        <div className="actions">
          <button
            className="btn-icon"
            onClick={() => onCopy(corto.shortCode)}
            title="Copy URL"
          >
            <FiCopy className="corto-action-icon" />
          </button>
          <button
            className="btn-icon"
            onClick={() => setShowQRCode(true)}
            title="Show QR Code"
          >
            <FaQrcode className="corto-action-icon" />
          </button>
          <button
            className="btn-icon"
            onClick={() => setShowEditModal(true)}
            title="Edit"
          >
            <FiEdit2 className="corto-action-icon" />
          </button>
          <button
            className="btn-icon btn-icon--danger"
            onClick={() => onDelete(corto.shortCode)}
            title="Delete"
          >
            <FiTrash2 className="corto-action-icon" />
          </button>
        </div>
        {showQRCode && (
          <QRCodePopup
            qrCode={corto.qrCode}
            onClose={() => setShowQRCode(false)}
          />
        )}
        {showEditModal && (
          <EditCortoPopup
            corto={corto}
            onClose={() => setShowEditModal(false)}
            onUpdate={onUpdate}
          />
        )}
      </td>
    </tr>
  );
}

const EditCortoPopup = ({ corto, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: corto.title || '',
    url: corto.url || '',
    shortCode: corto.shortCode || '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onUpdate(corto.shortCode, formData);
      onClose();
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        const validationError = err.response.data.error;
        if (typeof validationError === 'object') {
          const errorMessages = Object.values(validationError).join(', ');
          setError(errorMessages);
        } else {
          setError(validationError);
        }
      } else {
        setError('Failed to update corto. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-popup">
      <div className="settings-popup__overlay" onClick={onClose} />
      <div className="settings-popup__content">
        <div className="settings-popup__header">
          <h2 className="settings-popup__title">Edit Corto</h2>
          <button className="settings-popup__close" onClick={onClose}>
            <FiX className="settings-popup__close-icon" />
          </button>
        </div>
        <form className="settings-popup__body" onSubmit={handleSubmit}>
          <div className="settings-popup__section">
            <div className="settings-popup__option">
              <label className="settings-popup__label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="My awesome corto"
              />
            </div>
            <div className="settings-popup__option">
              <label className="settings-popup__label">Long URL</label>
              <div className="input-with-icon">
                <FiLink className="input-icon" />
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  required
                />
              </div>
            </div>
            <div className="settings-popup__option">
              <label className="settings-popup__label">Custom Alias</label>
              <div className="input-with-prefix">
                <span className="input-prefix">cortox.io/</span>
                <input
                  type="text"
                  name="shortCode"
                  value={formData.shortCode}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="my-custom-corto"
                />
              </div>
            </div>
          </div>

          {error && <div className="settings-popup__error">{error}</div>}

          <div className="settings-popup__footer">
            <button
              type="button"
              className="settings-popup__button settings-popup__button--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="settings-popup__button settings-popup__button--save"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
