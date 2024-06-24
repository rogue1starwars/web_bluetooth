"use client";

import { useState, useEffect } from "react";

export default function useDeviceOrientation() {
  const [orientation, setOrientation] = useState({
    alpha: null as number | null,
    beta: null as number | null,
    gamma: null as number | null,
  });
  function handleOrientation(event: DeviceOrientationEvent) {
    console.log(event.alpha, event.beta, event.gamma);
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
  }
  useEffect(() => {
    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation,
      true
    );
  });
  return orientation;
}
