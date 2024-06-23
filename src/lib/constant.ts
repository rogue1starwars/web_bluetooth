import { deviceInfo } from "@/lib/types";

export const DEVICE_INFO_INITIAL_STATE: deviceInfo = {
  hashUUID: {
    serviceUUID: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
    characteristicUUID: "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
  },
  bluetoothDevice: null,
  dataCharacteristic: null,
  hashUUID_lastConnected: "",
};
