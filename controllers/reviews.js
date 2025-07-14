const Listing = require("../models/listings");
const Review = require("../models/reviews");

module.exports = {
  postReview: async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    await listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${id}`);
  },
  
  destroyReview: async (req, res) => {
    let { id, reviewId } = req.params;
    console.log(id, reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  },
};
