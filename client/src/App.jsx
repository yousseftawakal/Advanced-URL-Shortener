import React, { useState, useEffect, useContext } from 'react';
import './styles/main.scss';
import logoLight from './assets/CortoX - White.png';
import logoDark from './assets/CortoX - Purple.png';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

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

// TODO: Replace with API call to fetch cortos

function App() {
  const [cortos, setCortos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCortos = async () => {
      try {
        // TODO: Replace with actual API call
      } catch (error) {
        console.error('Error fetching cortos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCortos();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      // TODO: Replace with actual API call
    } catch (error) {
      console.error('Error creating corto:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Replace with actual API call
    } catch (error) {
      console.error('Error deleting corto:', error);
    }
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
      // TODO: Add toast notification
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
            `"${corto.url}"`,
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
  const totalClicks = cortos.reduce((sum, corto) => sum + corto.clicks, 0);
  const avgClicksPerCorto =
    totalCortos > 0 ? Math.round(totalClicks / totalCortos) : 0;

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
        <p className="loading__text">Loading...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <main className="main">
          <div className="main__container">
            <div className="main__content">
              <div className="greeting">
                <h1 className="greeting__title">Hello, John</h1>
                <p className="greeting__subtitle">Welcome to your dashboard</p>
              </div>
              <StatsCards
                totalCortos={totalCortos}
                totalClicks={totalClicks}
                avgClicksPerCorto={avgClicksPerCorto}
              />
              <CreateCorto onSubmit={handleSubmit} />
              <YourCortos
                cortos={cortos}
                handleDelete={handleDelete}
                handleCopy={handleCopy}
                handleExport={handleExport}
              />
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
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
            <div className="header__avatar">JD</div>
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
        <SettingsPopup onClose={() => setIsSettingsOpen(false)} />
      )}
    </header>
  );
};

const SettingsPopup = ({ onClose }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    theme: theme,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, theme }));
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'theme') {
      console.log('Theme changed to:', value);
      toggleTheme(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement settings update
    console.log('Settings updated:', formData);
    onClose();
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
        <form className="settings-popup__body" onSubmit={handleSubmit}>
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

          <div className="settings-popup__section">
            <h3 className="settings-popup__section-title">Profile</h3>
            <div className="settings-popup__option">
              <label className="settings-popup__label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="settings-popup__input"
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
          </div>

          <div className="settings-popup__section">
            <h3 className="settings-popup__section-title">Password</h3>
            <div className="settings-popup__option">
              <label className="settings-popup__label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="settings-popup__input"
              />
            </div>
            <div className="settings-popup__option">
              <label className="settings-popup__label">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="settings-popup__input"
              />
            </div>
            <div className="settings-popup__option">
              <label className="settings-popup__label">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="settings-popup__input"
              />
            </div>
          </div>

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
            >
              Save Changes
            </button>
          </div>
        </form>
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
        <div className="stats-card__value">{totalClicks.toLocaleString()}</div>
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

function CreateCorto({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    longUrl: '',
    customAlias: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', longUrl: '', customAlias: '' });
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
              name="longUrl"
              value={formData.longUrl}
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
                name="customAlias"
                value={formData.customAlias}
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

        <button type="submit" className="btn btn--primary btn--create">
          Create Corto
        </button>
      </form>
    </div>
  );
}

function YourCortos({ cortos, handleDelete, handleCopy, handleExport }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredCortos = cortos.filter(
    (corto) =>
      corto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corto.url.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCortos.map((corto) => (
                  <CortoRow
                    key={corto.id}
                    corto={corto}
                    onDelete={() => handleDelete(corto.id)}
                    onCopy={() => handleCopy(corto.url)}
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

function CortoRow({ corto, onDelete, onCopy }) {
  return (
    <tr>
      <td>{corto.title}</td>
      <td>
        <a
          href={`https://${corto.url}`}
          className="corto-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {corto.url}
        </a>
      </td>
      <td>{corto.created}</td>
      <td>{corto.updated}</td>
      <td>{corto.clicks}</td>
      <td>
        <div className="corto-actions">
          <button className="corto-action-btn" title="Copy" onClick={onCopy}>
            <FiCopy className="corto-action-icon" />
          </button>
          <button
            className="corto-action-btn"
            title="Delete"
            onClick={onDelete}
          >
            <FiTrash2 className="corto-action-icon" />
          </button>
          <button className="corto-action-btn" title="Edit">
            <FiEdit2 className="corto-action-icon" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default App;
