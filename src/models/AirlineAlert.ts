export default interface AirlineAlert {
    airline: string;
    airlineCode: string;
    disposition: boolean;
    flightNumber: string;
    cityAirportCode: string;
    cityAirportName: string;
    expectedDateTime: Date;    
}