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
  const [log, setLog] = useState<{
    directionToDestination: number | null;
    currentDirection: number;
    currentLocation: { lat: number | null; long: number | null };
    directionDifference: number | null;
    commandNumber: string;

    error: {
      device: string;
      gps: string;
      orientation: string;
    };
  }>({
    directionToDestination: null,
    currentDirection: 0,
    currentLocation: { lat: null, long: null },
    directionDifference: null,
    commandNumber: "0",
    error: {
      device: "",
      gps: "",
      orientation: "",
    },
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

    let directionToDestination = null as number | null;
    let directionDifference = null as number | null;

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

          setLog((prevLog) => ({
            ...prevLog,
            currentLocation: location,
            error: {
              ...prevLog.error,
              gps: "",
            },
          }));

          directionToDestination = calculateDirectionToDestination({
            location,
            destination,
          });
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setLog((prevLog) => ({
            ...prevLog,
            error: {
              ...prevLog.error,
              gps: "Geolocation Error: " + error.message,
            },
          }));
        },
        options
      );
    } else {
      alert("Geolocation Not Available");
      setLog((prevLog) => ({
        ...prevLog,
        error: {
          ...prevLog.error,
          gps: "Geolocation Not Available",
        },
      }));
    }

    // Function to send command to the device
    async function sendCommand() {
      const currentDirection = orientation.alpha;
      const currentLocation = location;

      if (directionToDestination === null) {
        setLog((prevLog) => ({
          ...prevLog,
          error: {
            ...prevLog.error,
            gps: "GPS is not available",
          },
        }));
        return;
      }
      if (currentDirection === null) {
        setLog((prevLog) => ({
          ...prevLog,
          error: {
            ...prevLog.error,
            orientation: "Orientation is not available",
          },
        }));
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

      // Log the command
      setLog((prevLog) => ({
        ...prevLog,
        directionToDestination,
        currentDirection,
        currentLocation,
        directionDifference,
        commandNumber,
        error: {
          ...prevLog.error,
          gps: "",
          orientation: "",
        },
      }));

      // Return when device is not connected
      if (isConnected === false) {
        setLog((prevLog) => ({
          ...prevLog,
          error: {
            ...prevLog.error,
            device: "Device is not connected",
          },
        }));
        return;
      }

      // Write the command to the device
      await write({ deviceInfo, data: commandNumber });
    }

    // Set interval to send command
    const intervalId = setInterval(sendCommand, 100);

    // Cleanup function to stop watching position when the component unmounts
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      clearInterval(intervalId);
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation
      );
    };
  }, [deviceInfo, destination, isConnected]);

  return log;
}
