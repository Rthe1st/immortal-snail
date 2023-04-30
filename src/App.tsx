import { useEffect } from "react";
import { useState } from "react";
import possessedSnail from "./possessed_snail.webp";
import "./App.css";
import { headingDistanceTo, LatLon, moveTo } from "geolocation-utils";
import Radar from "./Radar";

// https://hypertextbook.com/facts/1999/AngieYee.shtml
const SNAIL_METERS_PER_SECOND = 0.013;
const SNAIL_METERS_PER_MILLISECOND = SNAIL_METERS_PER_SECOND / 1000;

interface SnailInformation {
  location: LatLon;
  timestamp: number;
}

function distanceToSnailTime(meters: number): number {
  return meters / SNAIL_METERS_PER_MILLISECOND;
}

function formatTimeTillSnail(milliseconds: number): string {
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const days = Math.floor(milliseconds / millisecondsInADay);
  milliseconds = milliseconds % millisecondsInADay;
  const millisecondsInAHour = 1000 * 60 * 60;
  const hours = Math.floor(milliseconds / millisecondsInAHour);
  milliseconds = milliseconds % millisecondsInAHour;
  const millisecondsInAMinute = 1000 * 60;
  const minutes = Math.floor(milliseconds / millisecondsInAMinute);
  const millisecondsInASecond = 1000;
  const seconds = Math.floor(milliseconds / millisecondsInASecond);
  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

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
      Your location is {location.lat.toFixed(2)}, {location.lon.toFixed(2)}. The
      snails location is {snailLocation.lat.toFixed(2)},{" "}
      {snailLocation.lon.toFixed(2)}. Snail is {Math.round(distance)} meters
      from you. If you do not move, it will reach you in{" "}
      {formatTimeTillSnail(distanceToSnailTime(distance))}
    </p>
  );
}

function App() {
  const [location, setLocation] = useState<LatLon | null>(null);
  const [dealMade, setDealMade] = useState<boolean>(false);

  const [snailInformation, setSnailInformation] =
    useState<SnailInformation | null>(null);

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
    if (location === null) {
      return;
    }
    const timer = setInterval(() => {
      setSnailInformation((snailInformation: SnailInformation | null) => {
        const now = Date.now();
        if (snailInformation === null) {
          return {
            location,
            timestamp: now,
          };
        } else {
          const heading = headingDistanceTo(
            snailInformation.location,
            location
          ).heading;
          const now = Date.now();
          const timeSinceLastMove = snailInformation.timestamp - now;
          const newLocation = moveTo(snailInformation.location, {
            heading: heading,
            // todo: logic to make sure the snail doesn't over shoot
            distance: SNAIL_METERS_PER_MILLISECOND * timeSinceLastMove,
          });
          return {
            location: newLocation,
            timestamp: now,
          };
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
      </header>
      {dealMade && snailInformation && location ? (
        <SnailChase
          snailLocation={snailInformation.location}
          location={location}
        />
      ) : (
        <button onClick={makeDeal}>Make deal with snail</button>
      )}
      <div>
        <Radar width={2000} height={2000} />
      </div>
    </div>
  );
}

export default App;
