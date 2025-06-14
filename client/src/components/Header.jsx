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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <Navbar className="border-b-2 px-2 py-2">
      <Link to="/">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500 dark:text-slate-300">Residence</span>
          <span className="text-slate-700 dark:text-white">Radar</span>
        </h1>
      </Link>

      {/* Search Input for Large Screens */}
      <form onSubmit={handleSubmit} className="hidden lg:block flex-1 mx-4">
        <TextInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          rightIcon={FaSearch}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className="flex items-center gap-2 md:order-2">
        {/* Search Button for Mobile */}
        <Button
          className="w-10 h-10 p-0 lg:hidden"
          color="gray"
          pill
          onClick={() => {
            // Optionally, you can implement a mobile search modal here
            // For now, just focus the search input (if present)
            const searchInput = document.getElementById('mobile-search-input');
            if (searchInput) searchInput.focus();
          }}
        >
          <AiOutlineSearch />
        </Button>

        {/* Theme Toggle Button - always visible */}
        <Button
          className="w-10 h-10 p-0 inline-flex items-center justify-center"
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
            <li className="hover:underline list-none">Sign In</li>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      {/* Responsive Search Input for Mobile (visible in collapse) */}
      <Navbar.Collapse>
        <form onSubmit={handleSubmit} className="block lg:hidden mb-2">
          <TextInput
            id="mobile-search-input"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            rightIcon={FaSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
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
        <Navbar.Link
          as={'div'}
          style={{
            display: 'inline-block',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#333333',
            backgroundColor: '#FFD700',
            borderRadius: '50px',
            padding: '2px 12px',
            textTransform: 'capitalize',
            cursor: 'pointer',
            transition: 'color 0.3s ease-in-out, transform 0.2s ease-in-out, background-color 0.3s ease-in-out',
          }}
          onClick={() => window.open('https://banglore-house-price-predictor.onrender.com/', '_blank')}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.backgroundColor = '#FF5722';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#333333';
            e.currentTarget.style.backgroundColor = '#FFD700';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span style={{ color: 'inherit', textDecoration: 'none' }}>
            Bangalore House Price Predictor
          </span>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
