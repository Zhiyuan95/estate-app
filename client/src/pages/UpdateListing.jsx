import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 10,
    discountedPrice: 0,
    parking: false,
    bathrooms: 1,
    bedrooms: 1,
    offer: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const listingId = params.listingId;

  useEffect(() => {
    //as we cant call an async func in useEffect, so need to define inside and call it
    const fetchListing = async () => {
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

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
      setImageUploadError("You can only upload 9 images per listing ");
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

  const handleChange = (e) => {
    const { id: targetId, type: targetType, checked, value } = e.target;

    if (["sell", "rent"].includes(targetId)) {
      setFormData({ ...formData, type: targetId });
      return;
    }

    ["parking", "offer", "furnished"].includes(targetId) &&
      setFormData({ ...formData, [targetId]: checked });

    ["number", "text", "textarea"].includes(targetType) &&
      setFormData({ ...formData, [targetId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setSubmitError("You must upload at least 1 image");
      }

      if (+formData.regularPrice <= +formData.discountedPrice) {
        return setSubmitError(
          "Discount price must be lower than regular price"
        );
      }
      setSubmitLoading(true);
      setSubmitError(false);
      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = res.json();
      setSubmitLoading(false);
      if (data.success === "false") {
        setSubmitLoading(false);
        setSubmitError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setSubmitError(error.message);
      setSubmitLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center font-semibold my-7 text-3xl">
        Update a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
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
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="rounded-lg p-3 border"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="rounded-lg p-3 border"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
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
                onChange={handleChange}
                value={formData.bedrooms}
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
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                className="rounded-lg border border-gray-300 p-3"
                min={10}
                max={99999999}
                type="number"
                id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / Month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-3 items-center">
                <input
                  className="rounded-lg border border-gray-300 p-3"
                  min={0}
                  max={99999999}
                  type="number"
                  id="discountedPrice"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / Month)</span>
                  )}
                </div>
              </div>
            )}
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
          <button
            disabled={
              submitLoading || uploading || submitError || imageUploadError
            }
            className="uppercase bg-slate-700 text-white text-center p-3 rounded-lg my-5 hover:opacity-90 disabled:opacity-80"
          >
            {submitLoading ? "updating..." : "update listing"}
          </button>
          {submitError && (
            <p className="text-red-700 text-sm">{submitError} </p>
          )}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
