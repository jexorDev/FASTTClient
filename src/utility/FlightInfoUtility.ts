export function buildFlightAwareLink(airline: string, flightNumber: string): string {
    return `https://flightaware.com/live/flight/${airline}${flightNumber}`;
}