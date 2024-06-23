"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { connect, write } from "./bluejelly"; // Ensure this path is correct
import useGeolocation from "./useGeolocation";
import { useBluetoothConnection } from "./useBluetoothConnection";

export default function Home() {
  //Initialize device information

  const location = useGeolocation();
  console.log(location);

  const { deviceInfo, isConnected, handleConnect } = useBluetoothConnection();

  const [isWriting, setIsWriting] = useState(false);

  async function handleWrite() {
    setIsWriting(true);
    await write({ deviceInfo, data: writeValue });
    setIsWriting(false);
  }

  const [writeValue, setWriteValue] = useState("");

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
    </>
  );
}
