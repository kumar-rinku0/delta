mapboxgl.accessToken = accessToken;
const newCoordinates = coordinates.split(",");
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: newCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 12, // starting zoom
  style: "mapbox://styles/mapbox/streets-v12",
  attributionControl: false,
}).addControl(
  new mapboxgl.AttributionControl({
    customAttribution: "Map design by me!",
  })
);

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserHeading: true,
  })
);

const popup = new mapboxgl.Popup({
  className: "map-popup",
  closeButton: true,
  closeButton: true,
  closeOnClick: true,
  closeOnMove: true,
})
  .setLngLat(newCoordinates)
  .setHTML(`${locationValue}`)
  .addTo(map);

const marker2 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(newCoordinates)
  .setPopup(popup)
  .addTo(map);
