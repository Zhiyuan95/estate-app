const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      {/*left side */}
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="capitalize whitespace-nowrap font-semibold">
              search term:
            </label>
            <input type="text" className="border rounded-lg p-3 w-full" />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type: </label>
            <div className="flex gap-2 items-center flex-wrap">
              <input type="checkbox" className="w-5" id="all" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input type="checkbox" className="w-5" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input type="checkbox" className="w-5" id="sell" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input type="checkbox" className="w-5" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities: </label>
            <div className="flex gap-2 items-center flex-wrap">
              <input type="checkbox" className="w-5" id="parking" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input type="checkbox" className="w-5" id="furnished" />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option>Price high to low</option>
              <option>Price low to hight</option>
              <option>Latest</option>
              <option>Oldest</option>
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
      </div>
    </div>
  );
};

export default Search;
