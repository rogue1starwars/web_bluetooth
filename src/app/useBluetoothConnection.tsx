// useBluetoothConnection.js
import { useState } from "react";
import { connect } from "./bluejelly"; // Ensure this path is correct
import { DEVICE_INFO_INITIAL_STATE } from "@/lib/constant";

export function useBluetoothConnection() {
  /*
    A custom hook that returns the device information and connection status
    All the device information are stored in the deviceInfo state. The Charactristic and the device are stored once the connection is established.
    The isConnected state is used to show the connection status.
    The handleConnect function is used to connect to the device. It calls the connect function from the bluejelly file and sets the deviceInfo state once the connection is established.
    */
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
