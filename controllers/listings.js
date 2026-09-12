const Listing = require("../models/listing");


async function getCoordinates(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'WanderLust-App' }
  });
  const data = await res.json();
  if (data.length === 0) throw new Error("Location not found");
  return {
    type: "Point",
    coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
  };
}

module.exports.index = async (req,res) =>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.createListing = async(req,res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  newListing.geometry = await getCoordinates(req.body.listing.location);
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
};

module.exports.showListing = async(req,res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("owner").populate({ path:"reviews", populate:{ path:"author" } });
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs",{listing});
};

module.exports.renderEditForm = async(req,res)=>{
  let{id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exists");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
  if(req.body.listing.location){
    listing.geometry = await getCoordinates(req.body.listing.location);
  }
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
  }
  await listing.save();
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
  let{id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};