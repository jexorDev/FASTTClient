<script setup lang="ts">
    import {ref} from "vue";
import AirlineAircraft from "../models/AirlineAircraft";
import axios from "axios";
import PaxVolumeHour from "../models/PaxVolumeHour";
import { getDateTimeFromString } from "../utility/DateTimeUtility";

    const airlineAircrafts = ref<AirlineAircraft[]>([]);
    const loading = ref(false);
    const airlineAircraftsLoaded = ref(false);
    const paxVolumePerHour = ref<PaxVolumeHour[]>([]);

    async function loadAirlineAircrafts() {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/AirlineAircrafts`).then((response) => {        
            airlineAircrafts.value = response.data as AirlineAircraft[];      
            airlineAircraftsLoaded.value = true;
        }).finally(() => loading.value = false);
    }

    async function saveAirlineAircrafts() {
        axios.put(`${import.meta.env.VITE_API_BASE_URL}/AirlineAircrafts`, 
            {
                airlineAircrafts: airlineAircrafts.value
            }
        );
    }

    async function loadPaxVolume() {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/Statistics?fromDateTime=${getDateTimeFromString("00:00").toISOString()}&toDateTime=${getDateTimeFromString("11:59").toISOString()}`).then((response) => {        
            paxVolumePerHour.value = response.data as PaxVolumeHour[];      
        }).finally(() => loading.value = false);
    }

</script>
<template>
    <h3>PAX VOLUME</h3>    
    <a @click="loadPaxVolume()">[LOAD]</a>
    <table>
        <tr>
            <th>HOUR</th>
            <th>ARRIVING PAX</th>
            <th>ARRIVING FLIGHTS</th>
            <th>DEPARTING PAX</th>
            <th>DEPARTING FLIGHTS</th>
        </tr>
        <tr v-for="row in paxVolumePerHour">
            <td>{{ row.hour }}</td>
            <td>{{ row.arrivingPassengers }}</td>
            <td>{{ row.arrivingFlights }}</td>
            <td>{{ row.departingPassengers }}</td>
            <td>{{ row.departingFlights }}</td>
        </tr>
    </table>
    <h3>AIRLINE AIRCRAFTS</h3>    
    <a @click="loadAirlineAircrafts()">[LOAD]</a>
    <table>
        <tr v-for="row in airlineAircrafts">
            <td>{{ row.airlineId }}</td>
            <td>{{ row.aircraftType }}</td>
            <td>
                <input type="text" v-model="row.seatCount"/>
            </td>
        </tr>
    </table>
    <a v-show="airlineAircraftsLoaded" @click="saveAirlineAircrafts">[SAVE]</a>
</template>