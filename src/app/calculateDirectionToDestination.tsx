import { convertTo0to360Range } from "@/lib/orientation";

export default function calculateDirectionToDestination({
  location,
  destination,
}: {
  location: { lat: number | null; long: number | null };
  destination: { lat: number | null; long: number | null };
}) {
  // If the location or destination is not available, return null
  if (location.lat === null || location.long === null) return null;
  if (destination.lat === null || destination.long === null) return null;

  // Calculate the direction to the destination
  const directionInCounterClock = Math.atan2(
    destination.long - location.long,
    destination.lat - location.lat
  );

  // Convert the direction to degrees
  const direction = convertTo0to360Range((directionInCounterClock - 90) * -1);
  return direction;
}
