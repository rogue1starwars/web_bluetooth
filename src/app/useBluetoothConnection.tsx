// useBluetoothConnection.js
import { useState } from "react";
import { connect } from "./bluejelly"; // Ensure this path is correct
import { DEVICE_INFO_INITIAL_STATE } from "@/lib/constant";

export function useBluetoothConnection() {
  const [deviceInfo, setDeviceInfo] = useState(DEVICE_INFO_INITIAL_STATE);
  const [isConnected, setIsConnected] = useState(false);

  async function handleConnect() {
    setIsConnected(false);
    const connection = await connect({ deviceInfo });
    if (connection) {
      const { device, characteristic } = connection;
      setDeviceInfo((prev) => ({
        ...prev,
        bluetoothDevice: device,
        dataCharacteristic: characteristic,
      }));
      setIsConnected(true);
    }
  }

  return { deviceInfo, isConnected, handleConnect };
}
