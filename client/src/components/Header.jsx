import { Button, Navbar, TextInput, Avatar, Dropdown } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { toggleTheme } from '../redux/theme/themeSlice';
import { errorHandler } from '../../../api/utils/error';


export default function Header() {
  const path = useLocation().pathname;
  const {currentUser} = useSelector(state => state.user);
  const { theme } =  useSelector((state) => state.theme);
  const [seacrhTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', seacrhTerm);
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
    } catch (error) {
    }
  };

  return ( 
    <Navbar className='border-b-2'>
      <Link to='/'>
      <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='text-slate-500 dark:text-slate-300'>Residence</span>
        <span className="text-slate-700 dark:text-white">Radar</span>
      </h1>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput 
            type="text"  
            placeholder="Search..." 
            value={seacrhTerm} 
            rightIcon={FaSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='hidden lg:inline'
        />
      </form>
      <div className='flex gap-2 md:order-2 items-center'>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
        <Button 
          className='w-12 h-10 hidden sm:inline' 
          color='gray' 
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.avatar} rounded />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
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
        ): (
          <Link to='/sign-in'>
              <li className='hover:underline'>Sign In</li>
          </Link>
            )}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={'div'}>
            <Link to='/'>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={'div'}>
            <Link to='/about'>About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/search?offer=true"} as={'div'}>
            <Link to='/search?offer=true'>Offer</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/search?type=rent"} as={'div'}>
            <Link to='/search?type=rent'>Rent</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/search?type=sale"} as={'div'}>
            <Link to='/search?type=sale'>Sale</Link>
          </Navbar.Link>

          
          <Navbar.Link 
  as={'div'}
  style={{
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 'bold', // Bold text
    textAlign: 'center',
    color: '#333333', // Dark text color for visibility (dark grey)
    backgroundColor: '#FFD700', // Gold background
    borderRadius: '50px', // Oval shape (rounded edges)
    padding: '2px 12px', // Padding for the oval shape
    textTransform: 'capitalize',
    cursor: 'pointer',
    transition: 'color 0.3s ease-in-out, transform 0.2s ease-in-out, background-color 0.3s ease-in-out', // Smooth transition for background
  }}
  onClick={() => window.open('https://github.com/anuvansh99/Banglore_House_Price_Predictor', '_blank')}
  onMouseEnter={(e) => {
    e.currentTarget.style.color = '#FFFFFF'; // White text on hover for contrast
    e.currentTarget.style.backgroundColor = '#FF5722'; // Darker red background on hover
    e.currentTarget.style.transform = 'scale(1.05)'; // Slight zoom on hover
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.color = '#333333'; // Dark text on hover revert
    e.currentTarget.style.backgroundColor = '#FFD700'; // Revert to gold background
    e.currentTarget.style.transform = 'scale(1)'; // Reset zoom
  }}
>
  <span style={{ color: 'inherit', textDecoration: 'none' }}>
    Bangalore House Price Predictor
  </span>
</Navbar.Link>

      </Navbar.Collapse>
      
    </Navbar>
  )
}
