"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { connect, write } from "./bluejelly"; // Ensure this path is correct
import useGeolocation from "./useGeolocation";
import { useBluetoothConnection } from "./useBluetoothConnection";
import useDeviceOrientation from "./useDeviceOrientation";
import { convertTo0to360Range } from "@/lib/orientation";
import { comma } from "postcss/lib/list";
import calculateDirectionToDestination from "./calculateDirectionToDestination";
import useControl from "./useControl";

export default function Home() {

  // Using the custom hook to get the device connection
  const { deviceInfo, isConnected, handleConnect } = useBluetoothConnection();

  // State to store the value to be written to the device

  const [destination, setDestination] = useState({
    lat: 0,
    long: 0,
  });

  function handleDestinationInput({ e, key }: { e: any; key: string }) {
    const value = e.target.value;
    // Check if the value is a valid floating-point number or empty (to allow clearing the input)
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setDestination({ ...destination, [key]: value });
    } else {
      alert("Please enter a valid number");
    }
  }


  // useEffectRef(
  //   (f) => {
  //     const intervalId = setInterval(() => f.current(), 100);
  //     return () => clearInterval(intervalId);
  //   },
  //   sendCommand,
  //   []
  // );




  const log2 = useControl({ deviceInfo, destination, isConnected });

  return (
    <>
      <h1>Destination</h1>
      <input
        value={String(destination.lat)}
        onChange={(e, key = "lat") => {
          handleDestinationInput({ e, key });
        }}
      />
      <input
        value={String(destination.long)}
        inputMode="numeric"
        onChange={(e, key = "long") => {
          handleDestinationInput({ e, key });
        }}
      />
      <h1>{isConnected ? "connected" : "not connected"}</h1>
      <button onClick={handleConnect}>connect</button>

      <h1>Log</h1>
      <p>{`Direction to destination: ${log2.directionToDestination}`}</p>
      <p>{`Current direction: ${log2.currentDirection}`}</p>
      <p>{`Current location lat: ${log2.currentLocation.lat}`}</p>
      <p>{`Current location long: ${log2.currentLocation.long}`}</p>
      <p>{`Direction difference: ${log2.directionDifference}`}</p>
      <p>{`Command number: ${log2.commandNumber}`}</p>
      <p>{`Device error: ${log2.error.device}`}</p>
      <p>{`GPS error: ${log2.error.gps}`}</p>
      <p>{`Orientation error: ${log2.error.orientation}`}</p>
    </>
  );
}
