"use client";

import { useState, useEffect } from "react";
import { convertAlphaToProperDirection } from "@/lib/orientation";
import { deviceInfo } from "@/lib/types";
import { write } from "./bluejelly";
import calculateDirectionToDestination from "./calculateDirectionToDestination";

export default function useControl({
  deviceInfo,
  destination,
  isConnected,
}: {
  deviceInfo: deviceInfo;
  destination: { lat: number | null; long: number | null };
  isConnected: boolean;
}) {
  const [log, setLog] = useState({
    directionToDestination: 0,
    currentDirection: 0,
    directionDifference: 0,
    commandNumber: "0",
  });

  useEffect(() => {
    // Get device Orientation
    let orientation = {
      alpha: null as number | null,
      beta: null as number | null,
      gamma: null as number | null,
    };
    function handleOrientation(event: DeviceOrientationEvent) {
      console.log(event.alpha, event.beta, event.gamma);
      if (event.alpha === null || event.beta === null || event.gamma === null) {
        alert("Device Orientation is not valid");
        return;
      }
      orientation = {
        alpha: convertAlphaToProperDirection(event.alpha, event.gamma),
        beta: event.beta,
        gamma: event.gamma,
      };
    }
    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation,
      true
    );

    // Get Geolocation
    let location = {
      lat: null as number | null,
      long: null as number | null,
    };

    let watchId: number;
    if ("geolocation" in navigator) {
      console.log("Geolocation Available");

      // Setting options for watchPosition
      const options = {
        enableHighAccuracy: true, // Whether to improve accuracy at the cost of response time and battery.
        timeout: 5000, // Maximum time allowed to return a position.
        maximumAge: 0, // Maximum age of a cached position that's acceptable to return.
      };

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("Latitude is :", position.coords.latitude);
          console.log("Longitude is :", position.coords.longitude);
          location = {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };
        },
        (error) => {
          alert("Geolocation Error:" + error);
        },
        options
      );
    } else {
      alert("Geolocation Not Available");
      // Optionally handle the case where geolocation is not available
    }

    //
    // Function to send command to the device
    async function sendCommand() {
      // Return when device is not connected
      if (isConnected === false) {
        alert("Device is not connected");
        return;
      }

      const directionToDestination = calculateDirectionToDestination({
        location,
        destination,
      });
      const currentDirection = orientation.alpha;

      if (directionToDestination === null) {
        alert("GPS location or Destinagion is not valid");
        return;
      }

      if (currentDirection === null) {
        alert("Device Orientation is not valid");
        return;
      }

      const directionDifference = directionToDestination - currentDirection;

      let commandNumber = "0"; // Default command

      if (Math.abs(directionDifference) < 10) {
        commandNumber = "1";
      } else if (directionDifference > 10) {
        commandNumber = "2";
      } else if (directionDifference < -10) {
        commandNumber = "3";
      }

      // Write the command to the device
      await write({ deviceInfo, data: commandNumber });
      // Log the command
      setLog({
        directionToDestination,
        currentDirection,
        directionDifference,
        commandNumber,
      });
    }

    // Set interval to send command
    const intervalId = setInterval(sendCommand, 100);

    // Cleanup function to stop watching position when the component unmounts
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      clearInterval(intervalId);
    };
  }, [deviceInfo, destination]);
  return log;
}
