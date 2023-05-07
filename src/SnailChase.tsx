import { degToRad, headingDistanceTo, LatLon } from "geolocation-utils";
import { useEffect, useState } from "react";
import Radar from "./Radar";
import {
  getSnailInfomation,
  SnailInformation,
  SNAIL_METERS_PER_MILLISECOND,
} from "./snailAi";

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

export default function SnailChase(props: {
  location: LatLon;
  onCaughtBySnail: () => void;
}) {
  let { location, onCaughtBySnail } = props;

  const [snailInformation, setSnailInformation] =
    useState<SnailInformation | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      // this is dodgey as hell, sort it out
      // should snail AI expose this via a useSnailLocation effect?
      const info = getSnailInfomation();
      if (info === null) {
        return;
      }
      const headingDistance = headingDistanceTo(info.location, location);
      if (headingDistance.distance < 5) {
        onCaughtBySnail();
        return;
      }
      setSnailInformation(info);
    }, 1000);
    return () => {
      clearInterval(id);
    };
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

  return (
    <>
      <p>
        Your location is {location.lat.toFixed(5)}, {location.lon.toFixed(5)}.
        The snails location is {snailInformation?.location.lat.toFixed(5)},{" "}
        {snailInformation?.location.lon.toFixed(5)}. Snail is{" "}
        {Math.round(distance)} meters from you. If you do not move, it will
        reach you in {formatTimeTillSnail(distanceToSnailTime(distance))}
      </p>
      <Radar snailX={snailXDistance} snailY={snailYDistance} />
    </>
  );
}
