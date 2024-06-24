"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { connect, write } from "./bluejelly"; // Ensure this path is correct
import useGeolocation from "./useGeolocation";
import { useBluetoothConnection } from "./useBluetoothConnection";
import useDeviceOrientation from "./useDeviceOrientation";
import { convertTo0to360Range } from "@/lib/orientation";
import { comma } from "postcss/lib/list";
import calculateDirectionToDestination from "./calculateDirectionToDestination";

export default function Home() {
  // Using the custom hook to get the location
  const location = useGeolocation();
  console.log(location);

  // Using the custom hook to get the device connection
  const { deviceInfo, isConnected, handleConnect } = useBluetoothConnection();

  const orientation = useDeviceOrientation();
  // State to store the value to be written to the device
  const [writeValue, setWriteValue] = useState("0");

  const [log, setLog] = useState({
    directionToDestination: 0,
    currentDirection: 0,
    directionDifference: 0,
    commandNumber: "0",
  });

  // Function to send command to the device
  async function sendCommand() {
    const directionToDestination = calculateDirectionToDestination({
      location,
      destination,
    });
    const currentDirection = orientation.alpha;

    if (directionToDestination === null || currentDirection === null) {
      return;
    }

    const directionDifference = directionToDestination - currentDirection;

    let commandNumber = "0"; // Default command

    if (Math.abs(directionDifference) < 10) {
      commandNumber = "1"; // Stop the device
    } else if (directionDifference > 0) {
      commandNumber = "2"; // Command for direction adjustment
    } else if (directionDifference < 0) {
      commandNumber = "3"; // Command for direction adjustment
    }

    setLog({
      directionToDestination,
      currentDirection,
      directionDifference,
      commandNumber,
    });
    setWriteValue(commandNumber);
    await write({ deviceInfo, data: commandNumber });
    return;
  }
  useEffect(() => {
    const intervalId = setInterval(sendCommand, 100);
    return () => clearInterval(intervalId);
  }, [isConnected]);

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

  return (
    <>
      <h1>GPS</h1>
      <p>{`lat: ${location.lat}`}</p>
      <p>{`long: ${location.long}`}</p>
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
      <h1>Command</h1>
      <p>{writeValue}</p>

      <h1>Orientation</h1>
      <p>{`alpha: ${orientation.alpha}`}</p>
      <p>{`beta: ${orientation.beta}`}</p>
      <p>{`gamma: ${orientation.gamma}`}</p>
      <br />
      <h1>Log</h1>
      <p>{`Direction to destination: ${log.directionToDestination}`}</p>
      <p>{`Current direction: ${log.currentDirection}`}</p>
      <p>{`Direction difference: ${log.directionDifference}`}</p>
      <p>{`Command number: ${log.commandNumber}`}</p>
    </>
  );
}
