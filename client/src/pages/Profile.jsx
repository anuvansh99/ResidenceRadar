import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setfile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Listings state
  const [showListingsClicked, setShowListingsClicked] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    // eslint-disable-next-line
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) =>
            setFormData({ ...formData, avatar: downloadURL })
          );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    setShowListingsClicked(true); // Mark that user clicked
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        setUserListings([]);
        return;
      }
      setUserListings(data);
      if (!data || data.length === 0) {
        setShowListingsError(true);
      }
    } catch (error) {
      setShowListingsError(true);
      setUserListings([]);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setfile(e.target.files[0])}
          type='file' ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt='profile img'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700 dark:text-red-400'>Error uploading the image</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700 dark:text-green-400'>Image uploaded</span>
          ) : (
            ''
          )}
        </p>
        <input type='text' placeholder='Username' id='username'
          defaultValue={currentUser.username} className='border p-3 rounded-lg dark:bg-slate-800' onChange={handleChange} />
        <input type='email' placeholder='Email' id='email'
          defaultValue={currentUser.email} className='border p-3 rounded-lg dark:bg-slate-800' onChange={handleChange} />
        <input type='password' placeholder='Password' id='password'
          className='border p-3 rounded-lg dark:bg-slate-800' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white 
          rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link to={'/create-listing'} className='bg-green-700 text-white p-3 rounded-lg uppercase
          text-center hover:opacity-95'>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 dark:text-red-500 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 dark:text-red-500 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 dark:text-red-500 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 dark:text-green-400 mt-5'>{updateSuccess ? 'User updated' : ''}</p>
      <button onClick={handleShowListings} className='text-green-700 dark:text-green-400 w-full'>
        Show Listings
      </button>
      {/* Listings and message only appear after user clicks "Show Listings" */}
      {showListingsClicked && (
        <>
          {(showListingsError || (userListings && userListings.length === 0)) && (
            <p className='text-red-700 dark:text-red-500 mt-5'>No listings to show</p>
          )}
          {userListings && userListings.length > 0 &&
            <div className='flex flex-col gap-4'>
              <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
              {userListings.map((listing) =>
                <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4 dark:bg-slate-800'>
                  <Link to={`/listing/${listing._id}`}>
                    <img src={listing.imageUrls[0]} alt='listing cover'
                      className='h-16 w-16 object-contain' />
                  </Link>
                  <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate'
                    to={`/listing/${listing._id}`}>
                    <p className='dark:text-white'>{listing.name}</p>
                  </Link>
                  <div className='flex flex-col item-center'>
                    <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 dark:text-red-400 uppercase'>Delete</button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-700 dark:text-green-400 uppercase'>Edit</button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          }
        </>
      )}
    </div>
  )
}
