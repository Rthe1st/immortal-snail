import { headingDistanceTo, LatLon, moveTo } from "geolocation-utils";
import { TimestampLocation } from "./App";

// https://hypertextbook.com/facts/1999/AngieYee.shtml
const SNAIL_METERS_PER_SECOND = 0.013 * 50;
export const SNAIL_METERS_PER_MILLISECOND = SNAIL_METERS_PER_SECOND / 1000;

export interface SnailInformation {
  location: LatLon;
  timestamp: number;
}

export interface SnailLogInformation extends SnailInformation {
  playerLocation: LatLon;
}

let snailLog: SnailLogInformation[] = [];

export function getSnailLog() {
  return snailLog;
}

// todo: save in browser storage
let snailInformation: SnailInformation | null = null;
let playerInformation: TimestampLocation | null = null;

export function updatePlayerInformation(timestampLocation: TimestampLocation) {
  playerInformation = timestampLocation;
}

// the react app should act like this is coming from a server
export function getSnailInfomation() {
  return snailInformation;
}

export function tryRestoreSnail() {
  const previousLog = window.localStorage.getItem("snailLog");
  if (previousLog !== null) {
    snailLog = JSON.parse(previousLog);
    snailInformation = snailLog[snailLog.length - 1];
    return true;
  }
  return false;
}

export function spawnSnail(location: LatLon) {
  snailInformation = {
    location: { lat: location.lat + 0.0002, lon: location.lon + 0.0002 },
    timestamp: Date.now(),
  };
  snailLog = [];
  // todo: this will not be good enough when accounting for people who do not have the site open often
  setInterval(snailTrack, 1000);
}

function snailTrack() {
  if (snailInformation === null) {
    throw Error(
      "snail information was null, was this called before spawnSnail?"
    );
  }
  if (playerInformation === null) {
    throw Error(
      "player information was null, was this called before we got their gps?"
    );
  }
  const now = Date.now();
  const heading = headingDistanceTo(
    snailInformation.location,
    playerInformation.location
  ).heading;
  const timeSinceLastMove = now - snailInformation.timestamp;
  const newLocation = moveTo(snailInformation.location, {
    heading: heading,
    // todo: logic to make sure the snail doesn't over shoot
    distance: SNAIL_METERS_PER_MILLISECOND * timeSinceLastMove,
  });
  const newInfo = {
    location: newLocation,
    timestamp: now,
    playerLocation: playerInformation.location,
  };
  snailLog.push(newInfo);
  localStorage.setItem("snailLog", JSON.stringify(snailLog));
  snailInformation = newInfo;
}
