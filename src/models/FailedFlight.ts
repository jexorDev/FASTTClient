export default interface FailedFlight {
    timestamp: string;
    errorMessage: string;
    serializedFlightInfo: string;
    isFixed: boolean;
}