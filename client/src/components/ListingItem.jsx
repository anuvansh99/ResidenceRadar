import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow
    overflow-hidden rounded-lg w-full sm:w-[330px] md:w-[240px] lg:w-[270px] mb-4'>
        <Link to={`/listing/${listing._id}`}>
            <img 
                src={listing.imageUrls[0]}
                alt='listing cover'
                className='h-[320px] sm:h-[220px] w-full object-cover
                hover:scale-105 transition-scale duration-300' />
            <div className='p-3 flex flex-col gap-2 w-full'>
                <p className='truncate text-lg font-semibold'>
                    {listing.name}
                </p>
                <div className='flex items-center gap-1'>
                    <MdLocationOn className='h-8 w-8 text-gray-700 dark:text-blue-400' />
                    <p className='text-sm text-gray-600 dark:text-blue-400 truncate w-full'>
                        {listing.address}
                    </p>
                </div>
                <p className='text-sm line-clamp-3'>
                    {listing.description}
                </p>
                <p className='text-slate-500 dark:text-slate-400 mt-2 font-semibold flex items-center'>
                ₹
                    {listing.offer ? 
                        listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                        {listing.type === 'sale' && listing.offer && ' OFF'}
                </p>
                <div className='flex gap-4'>
                    <div className='font-bold text-sm'>
                        {listing.bedrooms > 1 ? 
                            `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`}
                    </div>
                    <div className='font-bold text-sm'>
                        {listing.bathrooms > 1 ? 
                            `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}
