import Listing from "../modles/listing.modle.js";
import { errorHandler } from "../utils/error.js";

export const creatListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listingToDelete = await Listing.findById(req.params.id);

  if (!listingToDelete) return next(errorHandler(401, "Listing not found"));

  if (req.user.id !== listingToDelete.userRef)
    return next(errorHandler(401, "You can only delete your own listing"));

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(errorHandler(401, "Listing not found"));

  if (req.user.id !== listing.userRef)
    return next(errorHandler(401, "You can only edit your own listing"));

  try {
    const listingToEdit = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      //it enables us to gt a updated one instead of prev listing
      {
        new: true,
      }
    );
    res.status(200).json(listingToEdit);
  } catch (error) {
    next(error);
  }
};

export const getTheListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(401, "listing not found"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || 9);
    const startIndex = parseInt(req.query.startIndex || 0);

    //if the user don't specify a value of the 'offer', or set it to false, the query will return all records where
    //the 'offer' value is either true or false
    let offer = req.query.offer;
    //we want to list all properties with/without offer at the begining search
    if (!offer || offer === "false") {
      //find in DB where the offer is either true or false
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (!furnished || furnished === "false") {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (!parking || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (!type || type === "all") {
      type = { $in: ["sell", "rent"] };
    }

    const serachTerm = req.query.serachTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      //fuzzy search and case insensitive
      name: { $regex: serachTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
