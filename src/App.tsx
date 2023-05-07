import { useEffect } from "react";
import { useState } from "react";
import mockGps from "./mockGps";

import "./App.css";
import { LatLon } from "geolocation-utils";
import {
  spawnSnail,
  updatePlayerInformation,
  SnailLogInformation,
  getSnailLog,
  tryRestoreSnail,
  getSnailInfomation,
} from "./snailAi";

import Welcome from "./Welcome";
import Death from "./Death";
import SnailChase from "./SnailChase";

export interface TimestampLocation {
  location: LatLon;
  timestamp: number;
}

function App(props: { restoreSuccessful: boolean }) {
  const { restoreSuccessful } = props;

  const [caughtBySnail, setCaughtBySnail] = useState(false);
  const [log, setLog] = useState<SnailLogInformation[]>([]);
  const [location, setLocation] = useState<LatLon | null>(null);
  const [dealMade, setDealMade] = useState<boolean>(false);

  useEffect(() => {
    if (restoreSuccessful) {
      setDealMade(true);
      // this might not be needed
      setLog(getSnailLog());
    }
  }, [restoreSuccessful]);

  useEffect(() => {
    if (caughtBySnail) {
      return;
    }
    const id = navigator.geolocation.watchPosition((position) => {
      const playerInformation = {
        location: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        timestamp: Date.now(),
      };
      setLocation(playerInformation.location);
      updatePlayerInformation(playerInformation);
      setLog(getSnailLog());
    });
    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, [caughtBySnail]);

  const makeDeal = () => {
    spawnSnail(location!);
    setDealMade(true);
  };

  const reset = () => {
    setCaughtBySnail(false);
    setDealMade(false);
    setLog([]);
  };

  if (caughtBySnail) {
    return <Death locationLog={log} reset={reset} />;
  } else if (dealMade && location) {
    return (
      <SnailChase
        location={location}
        onCaughtBySnail={() => setCaughtBySnail(true)}
      />
    );
  } else if (dealMade && !location) {
    // this can happen when restoring snail before we get gps
    return <p>Previous snail found, hunt will resume once gps acquired</p>;
  } else {
    return (
      <Welcome makeDeal={makeDeal} playerLocationKnown={location !== null} />
    );
  }
}

export default App;
