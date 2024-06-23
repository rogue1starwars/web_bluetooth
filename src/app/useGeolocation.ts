import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState({
    lat: null as number | null,
    long: null as number | null,
  });

  useEffect(() => {
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
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation Error:", error);
        },
        options
      );
    } else {
      console.log("Geolocation Not Available");
      // Optionally handle the case where geolocation is not available
    }

    // Cleanup function to stop watching position when the component unmounts
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return location;
};

export default useGeolocation;
