import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaBath, FaBed, FaParking, FaChair } from "react-icons/fa";

const ListingCard = (props) => {
  const listing = props.listing;
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold ">
            $
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-AU")
              : listing.regularPrice.toLocaleString("en-AU")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-green-900 flex flex-row gap-4">
            <div className="font-semibold flex flex-row items-center gap-1 text-sm">
              <FaBed className="text-lg" />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <div className="font-semibold text-sm flex flex-row items-center gap-1 whitespace-nowrap">
              <FaBath className="" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
            <div className="font-semibold text-sm flex flex-row items-center gap-1 whitespace-nowrap">
              {listing.parking && <FaParking className="text-sm" />}
            </div>
            <div className="font-semibold text-sm flex flex-row items-center gap-1 whitespace-nowrap">
              {listing.furnished && <FaChair className="text-sm" />}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
