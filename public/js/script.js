const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 20);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png", {
  attribution: "Open Street Map",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log("the id for new marker is: ", id);
  map.setView([latitude, longitude]);
  if (markers[id]) {
    console.log("purana marker chalega");
    markers[id].setLatLng([latitude, longitude]);
  } else {
    console.log("naya marker banega");
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  console.log("disconnect ki id: ", id);
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
