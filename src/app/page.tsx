"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { connect, write } from "./bluejelly"; // Ensure this path is correct
import useGeolocation from "./useGeolocation";
import { useBluetoothConnection } from "./useBluetoothConnection";
import useDeviceOrientation from "./useDeviceOrientation";

export default function Home() {
  // Using the custom hook to get the location
  const location = useGeolocation();
  console.log(location);

  // Using the custom hook to get the device connection
  const { deviceInfo, isConnected, handleConnect } = useBluetoothConnection();

  // Function to write data to the device. Called when the "write" button is clicked
  async function handleWrite() {
    await write({ deviceInfo, data: writeValue });
  }

  // State to store the value to be written to the device
  const [writeValue, setWriteValue] = useState("");

  const orientation = useDeviceOrientation();

  return (
    <>
      <h1>GPS</h1>
      <p>{`lat: ${location.lat}`}</p>
      <p>{`long: ${location.long}`}</p>
      <h1>{isConnected ? "connected" : "not connected"}</h1>
      <button onClick={handleConnect}>connect</button>
      <br />
      <input
        value={writeValue}
        onChange={(e) => setWriteValue(e.target.value)}
      ></input>
      <button
        onClick={handleWrite}
        disabled={!isConnected}
        className={`${isConnected ? "bg-blue-500" : "bg-gray-300"} `}
      >
        write
      </button>
      <h1>Orientation</h1>
      <p>{`alpha: ${orientation.alpha}`}</p>
      <p>{`beta: ${orientation.beta}`}</p>
      <p>{`gamma: ${orientation.gamma}`}</p>
    </>
  );
}
