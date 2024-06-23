"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { connect, connectGatt, scan, write } from "./bluejelly"; // Ensure this path is correct
import useGeolocation from "./useGeolocation";

export default function Home() {
  //Initialize device information

  const [device_info, setDevice_info] = useState({
    hashUUID: {
      serviceUUID: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
      characteristicUUID: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
    },
    bluetoothDevice: null,
    dataCharacteristic: null,
    hashUUID_lastConnected: "",
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  const location = useGeolocation();
  console.log(location);

  return (
    <>
      <h1>GPS</h1>
      <p>{`lat: ${location.lat}`}</p>
      <p>{`long: ${location.long}`}</p>
      <h1>{isConnected ? "connected" : "not connected"}</h1>
      <button
        onClick={async () => {
          setIsConnected(false);
          const connection = await connect({ device_info });
          if (connection) {
            const { device, characteristic } = connection;
            setDevice_info((prev) => ({
              ...prev,
              bluetoothDevice: device,
              dataCharacteristic: characteristic,
            }));
            setIsConnected(true);
          }
        }}
      >
        scan
      </button>
      <br />
      <button
        onClick={async () => {
          setIsWriting(true);
          await write({ device_info, data: "Hello World" });
          setIsWriting(false);
        }}
        disabled={!isConnected}
        className={`${isConnected ? "bg-blue-500" : "bg-gray-300"} `}
      >
        write
      </button>
    </>
  );
}
