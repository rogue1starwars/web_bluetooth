"use client";

import { useState, useEffect } from "react";
import { convertAlphaToProperDirection } from "@/lib/orientation";

export default function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    alpha: null as number | null,
    beta: null as number | null,
    gamma: null as number | null,
  });

  useEffect(() => {
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
      setOrientation({
        alpha: convertAlphaToProperDirection(event.alpha, event.gamma),
        beta: event.beta,
        gamma: event.gamma,
      });
    }
    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation,
      true
    );
  }, []);
  return orientation;
}
