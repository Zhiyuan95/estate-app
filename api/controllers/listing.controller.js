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
