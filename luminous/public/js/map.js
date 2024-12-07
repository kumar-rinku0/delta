mapboxgl.accessToken = accessToken;
const newCoordinates = coordinates.split(",");
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: newCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 12, // starting zoom
  style: "mapbox://styles/mapbox/streets-v12",
});

// const marker1 = new mapboxgl.Marker({ color: "red" })
//   .setLngLat([75.81248, 26.920341])
//   .addTo(map);

// value = coordinates.split(",");
// console.log(value);

const marker2 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(newCoordinates)
  .addTo(map);

// const marker1 = new mapboxgl.Marker().setLngLat().addTo(map);
