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
      </Navbar.Collapse>
      
    </Navbar>
  )
}
