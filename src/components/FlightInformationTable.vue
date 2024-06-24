<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import Flight from "../models/Flight.js";
import {buildFlightAwareLink} from "../utility/FlightInfoUtility";
import {getDateTimeFromString, formatDateTimeToString} from "../utility/DateTimeUtility";

function loadFlights()  {
  loading.value = true;
  const fromDate = getDateTimeFromString(timeFrom.value);
  const toDate = getDateTimeFromString(timeTo.value);
  let dateOffset = 0;

  if (dayType.value === "TOMORROW") {
    dateOffset = 1;
  } else if (dayType.value === "YESTERDAY") {
    dateOffset = -1;
  }

  fromDate.setDate(fromDate.getDate() + dateOffset);
  toDate.setDate(toDate.getDate() + dateOffset);

  axios.get(`${import.meta.env.VITE_API_BASE_URL}/FlightData?dispositionType=${disposition.value}&flightNumber=${flightNumber.value}&fromDateTime=${fromDate.toISOString()}&toDateTime=${toDate.toISOString()}&airline=${airline.value}&city=${city.value}&includeCodesharePartners=${includeCodesharePartners.value}`).then((response) => {        
    flights.value = response.data as Flight[];      
  }).finally(() => loading.value = false);
}

function getCodesharePartnersString(partners: string[]): string {
  const partnersJoined = partners.join(" | ");

  return partnersJoined === "" ? "" : `|${partnersJoined}`;
}

function downloadResults() {
    const csvContent = flights.value.map(x => (x.disposition === 0 ? "ARRIVAL" : "DEPARTURE") + "," + x.airlineName + "," + x.cityName + "," + new Date(x.disposition === 0 ? x.scheduledArrivalTime : x.scheduledDepartureTime).getHours() + "," + (x.airportGate === "" ? "UNASSIGNED" : x.airportGate) + "\n");
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    window.open(encodedUri);
  }

const flights = ref<Flight[]>([]);
const disposition = ref(1);
const airline = ref("");
const city = ref("");
const timeFrom = ref("00:00");
const timeTo = ref("23:59");
const dayType = ref("TODAY");
const flightNumber = ref("");
const includeCodesharePartners = ref(false);
const problemAirlinesOnly = ref(false);

const loading = ref(false);

const numberResults = computed<number>(() => flights.value.length);

</script>

<template>
  <div>
    <div>FILTERS</div>
    <span>

    
    <table>
      <tr>
        <th>
          DISPOSITION
        </th>
        <th>
          DAY
        </th>
        <th>FLIGHT #</th>
        <th>
          {{ disposition === 1 ? "FROM" : "TO" }}
        </th>
        
        <th>
          AIRLINE
        </th>
        <th>
          TIME FROM
        </th>
        <th>
          TIME TO
        </th>
        <th>
          INCLUDE CODESHARE PARTNERS
          </th>
          <th>PROBLEM AND RESOLUTION VIEW</th>
        
      </tr>
      <tr>
        <td>
          <input type="radio" id="arrivals" name="disposition" value="1" @input="disposition = 1"> 
          <label for="arrivals">Arrivals</label>
          
          <input type="radio" id="departures" name="disposition" value="2" @input="disposition = 2"> 
          <label for="departures">Departures</label>
        </td>
        <td>
          <select v-model="dayType">
            <option>TODAY</option>
            <option>TOMORROW</option>
            <option>YESTERDAY</option>
          </select>
        </td>
        <td>
          <input v-model="flightNumber" type="text" placeholder="ex: 2313" style="width:75px">
        </td>
        <td>
          <input v-model="city" type="text" placeholder="ex: DEN" style="width:75px">
        </td>
        <td>
          <input v-model="airline" type="text" placeholder="ex: frontier, fft, f9" style="width:200px">
        </td>
        <td>
          <input v-model="timeFrom" type="text" placeholder="00:00" style="width:100px">
        </td>
        <td>
          <input v-model="timeTo" type="text" placeholder="23:59" style="width:100px">
        </td>
        <td>
            <input v-model="includeCodesharePartners" type="checkbox" style="display: inline;" />
            <div style="display: inline">
              {{ includeCodesharePartners ? 'YES' : 'NO' }}
            </div>
        </td>
        <td>
            <input v-model="problemAirlinesOnly" type="checkbox" style="display: inline;" />
            <div style="display: inline">
              {{ problemAirlinesOnly ? 'ON' : 'OFF' }}
            </div>
        </td>
        
      </tr>

    </table>

    
  </span>

    <div>
      <div style="display: inline;">NUMBER OF FLIGHTS: {{ numberResults }}</div>  
      <a @click="loadFlights" style="display: inline; margin-left: 15px;" :class="loading ? 'loading-cursor': ''" >{{ loading ? 'LOADING...' : '[REFRESH]' }}</a>
      <a @click="downloadResults" style="display: inline; margin-left: 15px;">[DOWNLOAD CSV]</a>
    </div>
  
    <table class="flight-table">
      <tr>
        <th>
          AIRLINE
        </th>
        <th>
          FLIGHT
        </th>
        <th>{{ disposition === 1 ? "FROM" : "TO" }}</th>
        <th>
          SCHEDULED
        </th>
        <th>ESTIMATED</th>
        <th>ACTUAL</th>
        <th>STATUS</th>
        <th>GATE</th>
        <th>SYSTEM UPDATED</th>
      </tr>
      <tr v-for="flight in flights">
        <td>{{ flight.airlineName }} {{ getCodesharePartnersString(flight.codesharePartners) }}</td>
        <td><a :href="buildFlightAwareLink(flight.airlineIdentifier, flight.flightNumber)" target="_blank">{{ flight.airlineIdentifier }}{{ flight.flightNumber }}</a></td>
        <td>{{ flight.cityName }}-{{ flight.cityAirportName }}</td>

        <td>{{ formatDateTimeToString(flight.disposition == 0 ? flight.scheduledArrivalTime : flight.scheduledDepartureTime) }}</td>
        <td>{{ formatDateTimeToString(flight.disposition == 0 ? flight.estimatedArrivalTime : flight.estimatedDepartureTime) }}</td>
        <td>{{ formatDateTimeToString(flight.disposition == 0 ? flight.actualArrivalTime : flight.actualDepartureTime) }}</td>
        <td>{{ flight.status }}</td>

        <td>{{ flight.airportGate }}</td>
        <td>{{ formatDateTimeToString(flight.lastUpdated) }}</td>
      </tr>
      
      </table>
     
  
    
  </div>
</template>

<style scoped>
.header {
  background-color: white;
  color: black;
  width: 100%;
}
.flight-table {
  width: 100%;
  height: 90%;
}
table, th, td {
  border-style: dashed;
  border-width: 1px;
  border-collapse: collapse;
}
.previous-search {
  color: white;
  background-color: gray;
  margin-top: 5px;
  cursor: pointer;
}
.query-input {
  width: 100%;
}
th {
  text-align: left
}
.loading-cursor {
  cursor:progress;
}

</style>
