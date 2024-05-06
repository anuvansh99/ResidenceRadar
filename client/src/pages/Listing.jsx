import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const {currentUser} = useSelector((state) => state.user);
    const params = useParams();
    useEffect(() => {
        const fetchListing = async () => {
            try { 
                    const res = await fetch(`/api/listing/get/${params.listingId}`);
                    const data = await res.json();
                    if(data.success === false) {
                        setError(true);
                        setLoading(false);
                        return;
                    }
                    setListing(data);
                    setLoading(false);
                    setError(false);
                } catch (error) {
                    setError(true);
                    setLoading(false);
                }
        };
        fetchListing();
    }, [params.listingId]);
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
        {listing && !loading && !error && ( 
          <div>
            <Swiper navigation>
              {listing.imageUrls.map((url) => ( 
              <SwiperSlide key={url}>
                <div className='h-[550px]' style={{ background: `url(${url}) center no-repeat`,
                backgroundSize: 'cover'}}>
                </div>
              </SwiperSlide>
              ))}
            </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 rounded-full w-12 h-12 flex
            justify-center items-center bg-slate-100 dark:bg-slate-800 cursor-pointer'>
                <FaShare 
                    className='text-slate-500 dark:text-white'
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 2000);
                    }}
                />
            </div>
            {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
            )}
            <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                <p className='text-2xl font-semibold'>
                    {listing.name} - ₹{' '}
                    {listing.offer ? 
                        (+listing.regularPrice - +listing.discountPrice).toLocaleString() : 
                        listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && ' / month'}
                </p> 
                <div className='flex items-center mt-6 gap-2 text-slate-600 dark:text-blue-400 text-sm'>
                    <FaMapMarkerAlt className='text-green-700 dark:text-green-400' />
                    {listing.address}
                </div>
                <div className='flex gap-4'>
                    <p className='bg-red-700 dark:bg-red-600 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </p>
                    {listing.offer && (
                        <p className='bg-green-700 dark:bg-green-600 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            ₹ {listing.discountPrice} OFF
                        </p>
                    )}
                </div>
                <p>
                    <span className='font-semibold text-black dark:text-blue-400'>
                        Description - {' '}
                    </span>
                    {listing.description}
                </p>
                <ul className='text-green-700 dark:text-green-400 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaBed className='text-lg' /> 
                        {listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaBath className='text-lg' /> 
                        {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaParking className='text-lg' /> 
                        {listing.parking ? 'Parking spot' : 'No Parking'}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaChair className='text-lg' /> 
                        {listing.furnished ? 'Furnished' : 'Unfurnished' }
                    </li>
                </ul>
                {currentUser && listing.userRef !== currentUser._id && !contact && (
                    <button onClick={() => setContact(true)}
                    className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                        Contact Landlord
                    </button>
                )}
                {contact && <Contact listing={listing}/>}
            </div>
          </div>
       )}
    </main>
  )
}
