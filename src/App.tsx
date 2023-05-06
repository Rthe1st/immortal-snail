import { useEffect } from "react";
import { useState } from "react";
// import possessedSnail from "./possessed_snail.webp";
import "./App.css";
import { headingDistanceTo, LatLon, degToRad } from "geolocation-utils";
import Radar from "./Radar";
import { SnailInformation, getSnailInfomation, spawnSnail } from "./snailAi";

import geolocate from "mock-geolocation";
import { SNAIL_METERS_PER_MILLISECOND } from "./snailAi";

geolocate.use();

geolocate.send({
  lat: 54.980206086231,
  lng: 82.898068362003,
});

setInterval(() => {
  geolocate.change({
    lat: 54.980206086231 + (-0.5 + Math.random()) * 0.01,
    lng: 82.898068362003 + (-0.5 + Math.random()) * 0.01,
  });
}, 1000);

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

function SnailChase(props: { location: LatLon }) {
  let { location } = props;

  const [snailInformation, setSnailInformation] =
    useState<SnailInformation | null>(null);

  useEffect(() => {
    setInterval(() => {
      // should snail AI expose this via a useSnailLocation effect?
      setSnailInformation(getSnailInfomation());
    }, 1000);
  }, []);

  var distance;
  var snailXDistance;
  var snailYDistance;
  if (snailInformation !== null) {
    const headingDistance = headingDistanceTo(
      snailInformation.location,
      location
    );
    snailXDistance =
      Math.sin(degToRad(headingDistance.heading)) * headingDistance.distance;
    snailYDistance =
      Math.cos(degToRad(headingDistance.heading)) * headingDistance.distance;
    distance = headingDistance.distance;
  } else {
    return <p>Loading snail location</p>;
  }

  if (distance < 5) {
    <p>Snail kill you ded</p>;
  }

  return (
    <>
      <p>
        Your location is {location.lat.toFixed(2)}, {location.lon.toFixed(2)}.
        The snails location is {snailInformation?.location.lat.toFixed(2)},{" "}
        {snailInformation?.location.lon.toFixed(2)}. Snail is{" "}
        {Math.round(distance)} meters from you. If you do not move, it will
        reach you in {formatTimeTillSnail(distanceToSnailTime(distance))}
      </p>
      <Radar snailX={snailXDistance} snailY={snailYDistance} />
    </>
  );
}

function App() {
  const [location, setLocation] = useState<LatLon | null>(null);
  const [dealMade, setDealMade] = useState<boolean>(false);
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

  const makeDeal = () => {
    setDealMade(true);
    spawnSnail(location!);
  };

  return (
    <div className="App">
      {/* todo: make the 2 paragraphs a bit more coherent */}
      {dealMade && location ? (
        <SnailChase location={location} />
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
          {location ? (
            <button onClick={makeDeal}>Make deal with snail</button>
          ) : (
            <p>Acquiring location</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
