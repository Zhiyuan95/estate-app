import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  console.log("file is: ", file);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(`formData is ${formData.avatar}`);

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

  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-center font-semibold my-7 text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 ">
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
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="rounded-lg p-3 border"
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="rounded-lg p-3 border"
        />
        <button className="uppercase rounded-lg p-3 bg-slate-700 text-white hover:opacity-90 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-2">
        <span className="text-red-500 cursor-pointer">Delete Account!</span>
        <span className="text-red-500">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
