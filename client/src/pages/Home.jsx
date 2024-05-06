import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  console.log(saleListings);
  console.log(rentListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSalesListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
    fetchRentListings();
    fetchSalesListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className=' font-bold text-3xl
        lg:text-6xl'>
          Find your <span className='text-blue-400'>dream</span> home 
          <br />
          right here
        </h1>
        <div className='text-gray-400 text-sm sm:text-sm'>
        ResidenceRadar is the place you were looking for to 
          find your next place to live.
          <br />
          We have any kind of place you dreamed of.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 dark:text-blue-600
        font-bold hover:underline'>
          Let's get started
        </Link>
      </div>
      {/*swiper */}
      <Swiper navigation>
        {
          offerListings && offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div className='h-[500px]' 
                style={{background: `url(${listing.imageUrls[0]}) center 
                no-repeat`, backgroundSize:'cover'}}>

                </div>
              </SwiperSlide>
            ))
        }
      </Swiper>
      {/* listings */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-8'>
          {
            offerListings && offerListings.length > 0 && (
              <div className=''>
                <div className='my-3'>
                  <h2 className='text-2xl font-semibold'>
                    Recent Offers
                  </h2>
                  <Link to={'/search?offer=true'}
                  className='text-sm text-blue-800 dark:text-blue-400 hover:underline'>
                    Show more offers
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                    offerListings.map((listing) => (
                      <ListingItem key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
              </div>  
            )
          }
          {
            rentListings && rentListings.length > 0 && (
              <div className=''>
                <div className='my-3'>
                  <h2 className='text-2xl font-semibold'>
                    Recent places for rent
                  </h2>
                  <Link to={'/search?type=rent'}
                  className='text-sm text-blue-800 dark:text-blue-400 hover:underline'>
                    Show more places for rent
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                    rentListings.map((listing) => (
                      <ListingItem key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
              </div>  
            )
          }
          {
            saleListings && saleListings.length > 0 && (
              <div className=''>
                <div className='my-3'>
                  <h2 className='text-2xl font-semibold'>
                    Recent places for sale
                  </h2>
                  <Link to={'/search?type=sale'}
                  className='text-sm text-blue-800 dark:text-blue-400 hover:underline'>
                    Show more for sale
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>
                  {
                    saleListings.map((listing) => (
                      <ListingItem key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
              </div>  
            )
          }
      </div>
    </div>
  )
}
