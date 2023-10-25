import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showUserListingError, setShowUserListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  //upload files to filrebase and track the process
  const handleFileUpload = (file) => {
    //get a storage reference
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    //create a storage reference
    const storageRef = ref(storage, fileName);
    //by calling uploadTask to upload files
    const uploadTask = uploadBytesResumable(storageRef, file);

    //track upload process, uploadTask.on can listen to the status of upload,
    //whenever the status changed, we'll get a new snapshot
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(process));
      },
      (err) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart(true));
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignoutUser = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/user/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signoutUserFailure(data));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowUserListingError(false);
      //in fetch the default method is GET
      //GET aims to retrieve data from server, so no body required
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowUserListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowUserListingError(error.message);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-center font-semibold my-7 text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 self-center mt-2 cursor-pointer object-cover"
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image Upload Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="username"
          className="rounded-lg p-3 border"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="rounded-lg p-3 border"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="rounded-lg p-3 border"
          onChange={handleChange}
        />
        <button className="uppercase rounded-lg p-3 bg-slate-700 text-white hover:opacity-90 disabled:opacity-80">
          {loading ? loading : "update"}
        </button>
        <Link
          className="bg-green-700 text-white border p-3 text-center rounded-lg uppercase"
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-2">
        <span
          onClick={handleDeleteUser}
          className="text-red-500 cursor-pointer"
        >
          Delete Account!
        </span>
        <span
          onClick={handleSignoutUser}
          className="text-red-500 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700"> {error ? error : ""} </p>
      <p className="text-green-700">
        {updateSuccess ? "Update user successfully" : ""}{" "}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 uppercase w-full"
      >
        show listings
      </button>
      <p className="text-red-700 mt-5">
        {showUserListingError ? "Error showing listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="h-16 w16 object-contain rounded-lg"
                  src={
                    listing.imageUrls[
                      Math.floor(Math.random() * listing.imageUrls.length)
                    ]
                  }
                  alt="listing cover"
                />
              </Link>
              <Link
                className="font-semibold hover:underline text-slate-700 flex-1 truncate"
                to={`/listing/${listing._id}`}
              >
                <span>{listing.name}</span>
              </Link>
              <div className="flex flex-col">
                <button
                  type="button"
                  className="uppercase text-red-700 cursor-pointer"
                  onClick={() => handleListingDelete(listing._id)}
                >
                  delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button
                    className="uppercase text-green-700 cursor-pointer"
                    type="button"
                  >
                    edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
