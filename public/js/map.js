const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tiles.openfreemap.org/styles/liberty', // STREET v12 Jaisa
    center: listing.geometry.coordinates,
    zoom: 9
});

const popup = new maplibregl.Popup({ offset: 25 })
  .setHTML(`<h6>${listing.location}</h6><p>Exact location after booking</p>`);

new maplibregl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);