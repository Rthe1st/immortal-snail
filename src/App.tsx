import { useEffect } from "react";
import { useState } from "react";
import possessedSnail from "./possessed_snail.webp";
import "./App.css";
import { headingDistanceTo, LatLon, moveTo } from "geolocation-utils";

function SnailChase(props: { location: LatLon; snailLocation: LatLon }) {
  let { snailLocation, location } = props;
  var distance;
  if (snailLocation !== null && location !== null) {
    distance = headingDistanceTo(snailLocation, location).distance;
  } else {
    distance = 0;
  }

  return (
    <p>
      Your location is {location?.lat}, {location?.lon}. The snails location is{" "}
      {snailLocation?.lat}, {snailLocation?.lon}. Snail is{" "}
      {Math.round(distance)} meters from you
    </p>
  );
}

function App() {
  const [location, setLocation] = useState<LatLon | null>(null);
  const [dealMade, setDealMade] = useState<boolean>(false);

  const [snailLocation, setSnailLocation] = useState<LatLon | null>(null);

  useEffect(() => {
    const id = navigator.geolocation.watchPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
      return () => {
        navigator.geolocation.clearWatch(id);
      };
    });
  }, []);

  useEffect(() => {
    if (!dealMade) {
      return;
    }
    const timer = setInterval(() => {
      setSnailLocation((snailLocation: LatLon | null) => {
        if (snailLocation === null) {
          return location;
        } else {
          return moveTo(snailLocation, {
            heading: 32.1,
            distance: 1,
          });
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [dealMade, location]);

  const makeDeal = () => {
    // make this conditional on the users location already being known
    setDealMade(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={possessedSnail}
          alt="Artist's impression of the immortal snail"
        />
        {dealMade && snailLocation && location ? (
          <SnailChase snailLocation={snailLocation} location={location} />
        ) : (
          <button onClick={makeDeal}>Make deal with snail</button>
        )}
      </header>
    </div>
  );
}

export default App;
