import { Button, Navbar, TextInput, Avatar, Dropdown } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { toggleTheme } from '../redux/theme/themeSlice';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowMobileSearch(false);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        return;
      }
    } catch (error) {}
  };

  return (
    <Navbar className="border-b-2 px-2 py-2 relative z-20">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500 dark:text-slate-300">Residence</span>
          <span className="text-slate-700 dark:text-white">Radar</span>
        </h1>
      </Link>

      {/* Desktop Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="hidden lg:flex flex-1 justify-center"
      >
        <TextInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          rightIcon={FaSearch}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md w-full"
        />
      </form>

      {/* Right section */}
      <div className="flex items-center gap-x-4 md:order-2">
        {/* Mobile Search Icon */}
        <Button
          className="w-10 h-10 p-0 lg:hidden"
          color="gray"
          pill
          onClick={() => setShowMobileSearch((prev) => !prev)}
          aria-label="Show search"
        >
          <AiOutlineSearch />
        </Button>

        {/* Predictor Button (desktop only, with left margin) */}
        <button
          type="button"
          className="hidden lg:inline-block font-bold text-sm text-[#333] bg-[#FFD700] rounded-full px-4 py-1 transition-all duration-200 hover:bg-[#FF5722] hover:text-white focus:outline-none ml-4"
          style={{
            textTransform: 'capitalize',
            letterSpacing: '0.01em',
          }}
          onClick={() => window.open('https://banglore-house-price-predictor.onrender.com/', '_blank')}
        >
          Bangalore House Price Predictor
        </button>

        {/* Theme Toggle Button */}
        <Button
          className="w-10 h-10 p-0 flex items-center justify-center"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>

        {/* User Dropdown or Sign In */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.avatar} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Link to={'/create-listing'}>
              <Dropdown.Item>Create Listing</Dropdown.Item>
            </Link>
            {/* <Dropdown.Divider /> */}
            {/* <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item> */}
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <li className="hover:underline list-none font-medium">Sign In</li>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-start justify-center lg:hidden">
          <div className="bg-white dark:bg-gray-800 w-full px-4 py-4 shadow-md border-b flex items-center gap-2">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <TextInput
                type="text"
                placeholder="Search..."
                value={searchTerm}
                rightIcon={FaSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                autoFocus
              />
              <Button type="submit" color="gray" pill>
                <FaSearch />
              </Button>
              <Button
                type="button"
                color="gray"
                pill
                onClick={() => setShowMobileSearch(false)}
                aria-label="Close search"
              >
                ✕
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Navbar Collapse (mobile menu) */}
      <Navbar.Collapse>
        {/* Predictor Button (mobile menu) */}
        <button
          type="button"
          className="lg:hidden font-bold text-sm text-[#333] bg-[#FFD700] rounded-full px-4 py-1 transition-all duration-200 hover:bg-[#FF5722] hover:text-white focus:outline-none mb-2"
          style={{
            textTransform: 'capitalize',
            letterSpacing: '0.01em',
          }}
          onClick={() => window.open('https://banglore-house-price-predictor.onrender.com/', '_blank')}
        >
          Bangalore House Price Predictor
        </button>
        <Navbar.Link active={path === "/"} as={'div'}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={'div'}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/search?offer=true"} as={'div'}>
          <Link to="/search?offer=true">Offer</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/search?type=rent"} as={'div'}>
          <Link to="/search?type=rent">Rent</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/search?type=sale"} as={'div'}>
          <Link to="/search?type=sale">Sale</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
