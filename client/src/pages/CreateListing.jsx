import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  console.log("formData are", formData);
  const handleImagesUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 10) {
      setUploading(true);
      //Run multiple async tasks at once and wait for all to finish before moving on
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          //we want to store previous imgUrls, not cover them by using concat
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 9 images per listing");
      setUploading(false);
    }
  };

  //It ends up returning a promise. It uploads an image to Firebase and returns an image URL from Firebase
  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const process =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${Math.round(process)}% done`);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (indexToDelete) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter(
        (_, index) => index != indexToDelete
      ),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center font-semibold my-7 text-3xl">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        {/* Left Side */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="rounded-lg p-3 border"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="rounded-lg p-3 border"
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="rounded-lg p-3 border"
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-7">
            <div className="flex gap-3 items-center">
              <input
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={21}
                type="number"
                id="bedrooms"
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={21}
                type="number"
                id="bathrooms"
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={21}
                type="number"
                id="Regular price"
              />
              <div className="flex flex-col">
                <p>Regular price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <input
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={21}
                type="number"
                id="Discounted price"
              />
              <div className="flex flex-col">
                <p>Discounted price</p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>
        {/*Right Side */}
        <div className="flex flex-col flex-1 gap-4">
          <p>
            <b>Images:</b> The first image will be the cover (max 6)
          </p>
          <div className="flex gap-3">
            <input
              type="file"
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              id="imageUpload"
              multiple
              accept="image/*"
              className="border border-gray-300 p-3 rounded-md"
            />
            <button
              type="button"
              onClick={handleImagesUpload}
              className="border border-green-600 p-3 rounded-md uppercase text-green-600 hover:shadow-lg disabled:opacity-80 "
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {/* <div className="">
            <p className="text-red-700">
              Total number of images must be less than 7 and at least 1 image
              must be selected
            </p>
          </div> */}
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}{" "}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center rounded-md"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-40 h-40 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75 "
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="uppercase bg-slate-700 text-white text-center p-3 rounded-lg my-5 hover:opacity-90 disabled:opacity-80">
            create listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
