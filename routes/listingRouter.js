const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.postListing)
  );

router.get("/search", listingController.search);

// Search route
router.get("/new", isLoggedIn, wrapAsync(listingController.newCreateForm));

// Category routes
router.get("/rooms", wrapAsync(listingController.rooms));
router.get("/cities", wrapAsync(listingController.cities));
router.get("/mountains", wrapAsync(listingController.mountains));
router.get("/castles", wrapAsync(listingController.castles));
router.get("/camping", wrapAsync(listingController.camping));
router.get("/farms", wrapAsync(listingController.farms));
router.get("/arctic", wrapAsync(listingController.arctic));
router.get("/domes", wrapAsync(listingController.domes));
router.get("/boats", wrapAsync(listingController.boats));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);

module.exports = router;
