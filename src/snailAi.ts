import { headingDistanceTo, LatLon, moveTo } from "geolocation-utils";

// https://hypertextbook.com/facts/1999/AngieYee.shtml
const SNAIL_METERS_PER_SECOND = 0.013;
export const SNAIL_METERS_PER_MILLISECOND = SNAIL_METERS_PER_SECOND / 1000;

export interface SnailInformation {
  location: LatLon;
  timestamp: number;
}

// todo: save in browser storage
let snailInformation: SnailInformation | null = null;

// the react app should act like this is coming from a server
export function getSnailInfomation() {
  return snailInformation;
}

export function spawnSnail(location: LatLon) {
  if (snailInformation !== null) {
    throw Error("Cannot spawn snail, snail already spawned");
  }
  snailInformation = {
    location,
    timestamp: Date.now(),
  };
  // todo: this will not be good enough when accounting for people who do not have the site open often
  setInterval(() => {
    if (snailInformation === null) {
      throw Error(
        "snail information was null, was this called before spawnSnail?"
      );
    }
    const now = Date.now();
    const heading = headingDistanceTo(
      snailInformation.location,
      location
    ).heading;
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
  }, 1000);
}
