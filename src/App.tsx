import { useEffect } from "react";
import { useState } from "react";
// import possessedSnail from "./possessed_snail.webp";
import "./App.css";
import { headingDistanceTo, LatLon, moveTo, degToRad } from "geolocation-utils";
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
  var snailXDistance;
  var snailYDistance;
  if (snailLocation !== null && location !== null) {
    const headingDistance = headingDistanceTo(snailLocation, location);
    snailXDistance =
      Math.sin(degToRad(headingDistance.heading)) * headingDistance.distance;
    snailYDistance =
      Math.cos(degToRad(headingDistance.heading)) * headingDistance.distance;
    distance = headingDistance.distance;
  } else {
    distance = 0;
    snailXDistance = 0;
    snailYDistance = 0;
  }

  return (
    <>
      <p>
        Your location is {location.lat.toFixed(2)}, {location.lon.toFixed(2)}.
        The snails location is {snailLocation.lat.toFixed(2)},{" "}
        {snailLocation.lon.toFixed(2)}. Snail is {Math.round(distance)} meters
        from you. If you do not move, it will reach you in{" "}
        {formatTimeTillSnail(distanceToSnailTime(distance))}
      </p>
      <Radar
        width={2000}
        height={2000}
        snailX={snailXDistance}
        snailY={snailYDistance}
      />
    </>
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
      {/* todo: make the 2 paragraphs a bit more coherent */}
      {dealMade && snailInformation && location ? (
        <SnailChase
          snailLocation={snailInformation.location}
          location={location}
        />
      ) : (
        <>
          <p>
            The legend of the Immortal Snail was whispered among the shadowy
            underworld of the city, a tale too strange to be believed but too
            alluring to be ignored. They said the snail was cursed with
            immortality, a shell-bound creature that defied death itself. But
            the catch was that if it touched anyone, that person would inherit
            the snail's immortality, and the snail would stop at nothing to hunt
            them down and claim what was rightfully its own. The story spread
            like wildfire, and soon enough, people were willing to pay a high
            price to catch the elusive snail and claim its immortality for
            themselves. But little did they know that the snail was not to be
            trifled with, and that its pursuit would lead them down a dark path
            of danger, betrayal, and the eternal curse of life without end.
          </p>
          <p>
            Are you tired of living in constant fear of the immortal snail? Do
            you want to prepare yourself to escape the snail's relentless
            pursuit? Look no further than our website dedicated to helping
            people practice escaping the immortal snail! Our website provides a
            safe and realistic environment for you to hone your skills and learn
            new tactics for evading the immortal snail. With a variety of
            challenges and scenarios, you'll be able to improve your agility,
            strategic thinking, and survival instincts. Our team of experts has
            years of experience in studying the immortal snail's behavior and
            can offer valuable insights into how to outsmart and outrun this
            elusive creature. Whether you're a seasoned survivor or a newbie
            looking to learn the ropes, our website has something for everyone.
            You'll have access to a supportive community of fellow escape
            artists who can offer advice, encouragement, and friendly
            competition. Plus, with regular updates and new challenges added all
            the time, you'll never get bored or complacent. Give yourself the
            confidence you need to touch the immortal snail when your chance
            comes.
          </p>
          <button onClick={makeDeal}>Make deal with snail</button>
        </>
      )}
    </div>
  );
}

export default App;
