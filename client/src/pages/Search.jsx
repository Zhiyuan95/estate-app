import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../component/ListingCard";

const Search = () => {
  const [sidebarState, setSidebarState] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  console.log("listing is", listings);
  console.log("sidebarState is:", sidebarState);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const {
      id: targetId,
      value: targetValue,
      checked: targetChecked,
    } = e.target;
    ["all", "rent", "sell"].includes(targetId) &&
      setSidebarState({ ...sidebarState, type: targetId });

    targetId === "searchTerm" &&
      setSidebarState({ ...sidebarState, searchTerm: targetValue || "" });

    ["offer", "furnished", "parking"].includes(targetId) &&
      setSidebarState({
        ...sidebarState,
        [targetId]: targetChecked || targetChecked === "true" ? true : false,
      });

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  //pass form data to url
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    // retrieve sidebarState obj, set each key-value pair as a query params
    for (const [key, value] of Object.entries(sidebarState)) {
      urlParams.set(key, value);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  /* 
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarState({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
  }, [location.search])*/

  useEffect(() => {
    /* pass url data to form */

    const urlParams = new URLSearchParams(location.search);
    // Define a mapping where keys are the state keys and values are the default values fetched from the URL.
    const defaults = {
      searchTerm: "",
      type: "all",
      offer: "false",
      parking: "false",
      furnished: "false",
      sort: "created_at",
      order: "desc",
    };

    let updatedState = {};

    // Iterate over the mapping to set the state.
    for (let key in defaults) {
      if (key === "offer" || key === "parking" || key === "furnished") {
        updatedState[key] = urlParams.get(key) === "true";
      } else {
        updatedState[key] = urlParams.get(key) || defaults[key];
      }
    }
    setSidebarState((prevState) => ({ ...prevState, ...updatedState }));

    /* fetch listing from DB */

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      if (data.success === false) {
        console.log(data.message);
      }
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      console.log(data.length);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    data.length < 9 && setShowMore(false);

    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/*left side */}
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="capitalize whitespace-nowrap font-semibold">
              search term:
            </label>
            <input
              type="text"
              id="searchTerm"
              className="border rounded-lg p-3 w-full"
              value={sidebarState.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type: </label>
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="checkbox"
                className="w-5"
                id="all"
                onChange={handleChange}
                checked={sidebarState.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={sidebarState.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="checkbox"
                className="w-5"
                id="sell"
                onChange={handleChange}
                checked={sidebarState.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={sidebarState.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities: </label>
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={sidebarState.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={sidebarState.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      {/*right side */}
      <div className="flex-1">
        <h1 className="capitalize text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          listing results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <h1 className="text-xl text-slate-700 capitalize">
              no results found
            </h1>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 cursor-pointer hover:underline p-7 w-full text-center"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
