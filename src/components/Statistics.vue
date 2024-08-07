<script setup lang="ts">
    import {ref, computed} from "vue";
import AirlineAircraft from "../models/AirlineAircraft";
import axios from "axios";
import PaxVolumeHour from "../models/PaxVolumeHour";
import { getDateTimeFromString } from "../utility/DateTimeUtility";

    const airlineAircrafts = ref<AirlineAircraft[]>([]);
    const loading = ref(false);
    const paxVolumePerHour = ref<PaxVolumeHour[]>([]);

    async function loadAirlineAircrafts() {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/AirlineAircrafts`).then((response) => {        
            airlineAircrafts.value = response.data as AirlineAircraft[];      
        }).finally(() => loading.value = false);
    }

    async function populateAirlineAircrafts() {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/AirlineAircrafts`).then(() => {        
            loadAirlineAircrafts();
        });
    }

    async function saveAirlineAircrafts() {
        axios.put(`${import.meta.env.VITE_API_BASE_URL}/AirlineAircrafts`, 
            {
                airlineAircrafts: airlineAircrafts.value
            }
        );
    }

    async function loadPaxVolume() {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/Statistics?fromDateTime=${getDateTimeFromString("00:00").toISOString()}&toDateTime=${getDateTimeFromString("23:59").toISOString()}`).then((response) => {        
            paxVolumePerHour.value = (response.data as PaxVolumeHour[]).sort((a, b) => getLocalHour(a.hour) -  getLocalHour(b.hour));      
        }).finally(() => loading.value = false);
    }

    function downloadPaxVolume() {
        const csvContent = paxVolumePerHour.value.map(x => getLocalHour(x.hour) + "," + x.arrivingPassengers + "," + x.departingPassengers + "," + x.arrivingFlights + "," + x.departingFlights + "\n");
        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        window.open(encodedUri);
    }

    function getLocalHour(hourUtc: number): number {
        var dateUtc = new Date();
        dateUtc.setUTCHours(hourUtc);
        return dateUtc.getHours();
    }

    const totalArrivingPax = computed(() => paxVolumePerHour.value.map(x => x.arrivingPassengers).reduce((y, acc) => acc + y, 0));
    const totalArrivingFlights = computed(() => paxVolumePerHour.value.map(x => x.arrivingFlights).reduce((y, acc) => acc + y, 0));
    const totalDepartingPax = computed(() => paxVolumePerHour.value.map(x => x.departingPassengers).reduce((y, acc) => acc + y, 0));
    const totalDepartingFlights = computed(() => paxVolumePerHour.value.map(x => x.departingFlights).reduce((y, acc) => acc + y, 0));
    
</script>
<template>
    <h3>PAX VOLUME</h3>    
    <a @click="loadPaxVolume()">[LOAD]</a>
    <a @click="downloadPaxVolume()" v-show="paxVolumePerHour.length > 0">[DOWNLOAD CSV]</a>
    <table>
        <tr>
            <th>HOUR</th>
            <th>ARRIVING PAX</th>
            <th>ARRIVING FLIGHTS</th>
            <th>DEPARTING PAX</th>
            <th>DEPARTING FLIGHTS</th>
        </tr>
        <tr v-for="row in paxVolumePerHour">
            <td>{{ getLocalHour(row.hour) }}</td>
            <td>{{ row.arrivingPassengers }}</td>
            <td>{{ row.arrivingFlights }}</td>
            <td>{{ row.departingPassengers }}</td>
            <td>{{ row.departingFlights }}</td>
        </tr>
        <tr>
            <td>TOTAL</td>
            <td>{{totalArrivingPax}}</td>
            <td>{{totalArrivingFlights}}</td>
            <td>{{totalDepartingPax}}</td>
            <td>{{totalDepartingFlights}}</td>
        </tr>
    </table>
    <h3>AIRLINE AIRCRAFTS</h3>    
    <a @click="populateAirlineAircrafts()">[LOAD]</a>
    <a v-show="airlineAircrafts.length > 0" @click="saveAirlineAircrafts">[SAVE]</a>
    <table>
        <tr v-for="row in airlineAircrafts">
            <td>{{ row.airlineId }}</td>
            <td>{{ row.aircraftType }}</td>
            <td>
                <input type="text" v-model="row.seatCount"/>
            </td>
        </tr>
    </table>
    
</template>