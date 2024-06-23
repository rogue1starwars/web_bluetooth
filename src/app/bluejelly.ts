import { device_info } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

// Export a named function or default function
export async function scan({
  device_info,
  setDevice_info,
}: {
  device_info: device_info;
  setDevice_info: Dispatch<SetStateAction<device_info>>;
}) {
  if (device_info.bluetoothDevice === null) {
    try {
      console.log("scanning for devices");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [device_info.hashUUID.serviceUUID],
      });
      console.log(device.name);
      console.log(device.id);
      console.log(device.gatt.connected);
      setDevice_info((prev) => ({ ...prev, bluetoothDevice: device }));
      console.log(device_info);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("device already connected");
  }
}

export async function connectGatt({
  device_info,
  setDevice_info,
}: {
  device_info: device_info;
  setDevice_info: Dispatch<SetStateAction<device_info>>;
}) {
  if (device_info.bluetoothDevice !== null) {
    if (
      device_info.bluetoothDevice.gatt.connected &&
      device_info.dataCharacteristic !== null
    ) {
      console.log("device already connected");
      return;
    }
    try {
      console.log("connecting to gatt server");
      const server = await device_info.bluetoothDevice.gatt.connect();
      console.log("Getting service");
      const service = await server.getPrimaryService(
        device_info.hashUUID.serviceUUID
      );
      console.log("Getting characteristic");
      const characteristic = await service.getCharacteristic(
        device_info.hashUUID.characteristicUUID
      );
      setDevice_info((prev) => ({
        ...prev,
        dataCharacteristic: characteristic,
      }));
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("device not connected");
  }
}

export async function connect({ device_info }: { device_info: device_info }) {
  //Checking if the device is already connected
  if (device_info.bluetoothDevice === null) {
    try {
      console.log("scanning for devices");
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [device_info.hashUUID.serviceUUID],
      });

      // Connecting to the GATT server
      console.log("connecting to gatt server");
      const server = await device.gatt.connect();
      console.log("Getting service");
      const service = await server.getPrimaryService(
        device_info.hashUUID.serviceUUID
      );
      console.log("Getting characteristic");
      const characteristic = await service.getCharacteristic(
        device_info.hashUUID.characteristicUUID
      );
      return { device, characteristic };
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("device already connected");
  }
}

export async function write({
  device_info,
  data,
}: {
  device_info: device_info;
  data: string;
}) {
  if (device_info.dataCharacteristic !== null) {
    try {
      console.log("writing data");
      await device_info.dataCharacteristic.writeValue(
        new TextEncoder().encode(data)
      );
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log("device not connected");
  }
}
