const Listing = require("../models/listings");
const nominatim = require("nominatim-client");

// Category
const category = (category) => {
  return async (req, res) => {
    const allListing = await Listing.find({ category });
    res.render("listings/index.ejs", { allListing });
  };
};

// Routes
module.exports = {
  index: async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  },

  newCreateForm: async (req, res) => {
    res.render("listings/new.ejs");
  },

  postListing: async (req, res) => {
    const client = nominatim.createClient({
      useragent: "wanderlust",
      referer: "https://wanderlust.com",
    });

    async function geocode(address) {
      const result = await client.search({
        q: address,
        addressdetails: 1,
        limit: 1,
      });
      return result[0];
    }

    const geo = await geocode(req.body.listing.location);
    // console.log(geo);
    const coords = [parseFloat(geo.lon), parseFloat(geo.lat)];
    const address = geo.display_name;

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.location = address;
    newListing.geometry = {
      type: "Point",
      coordinates: coords,
    };

    await newListing.save();
    console.log(newListing);
    req.flash("success", "List created successfully!");
    res.redirect("/listings");
  },

  showListing: async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      req.flash("error", "The list you are searhing is no longer exists!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  },

  editForm: async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "The list you want to edit is no longer exists!");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/uploads", "/uploads/h_30,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  },

  updateListing: async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
    req.flash("success", "List Updated successfully!");
    res.redirect(`/listings/${id}`);
  },

  destroyListing: async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "List deleted successfully!");
    res.redirect("/listings");
  },

  // Search
  search: async (req, res) => {
    let country = req.query.country;
    if (country) {
      const allListing = await Listing.find({
        country: { $regex: country, $options: "i" },
      });
      res.render("listings/index.ejs", { allListing });
    } else {
      req.flash("error", "Please enter valid country.");
      res.redirect("/listings");
    }
  },
  rooms: category("rooms"),
  cities: category("cities"),
  mountains: category("mountains"),
  castles: category("castles"),
  camping: category("camping"),
  farms: category("farms"),
  arctic: category("arctic"),
  domes: category("domes"),
  boats: category("boats"),
};
