import geolocate from "mock-geolocation";

let calledAlready = false;

export default function mockGps() {
  if (calledAlready) {
    throw Error("cannot mockGps more then once");
  }
  calledAlready = true;
  geolocate.use();

  geolocate.send({
    lat: 54.980206086231,
    lng: 82.898068362003,
  });

  setInterval(() => {
    geolocate.change({
      lat: 54.980206086231 + (-0.5 + Math.random()) * 0.00001,
      lng: 82.898068362003 + (-0.5 + Math.random()) * 0.00001,
    });
  }, 1000);
}
