<script setup lang="ts">
    import {ref} from "vue";
import AirlineAircraft from "../models/AirlineAircraft";
import axios from "axios";

    const airlineAircrafts = ref<AirlineAircraft[]>([]);
    const loading = ref(false);
    const airlineAircraftsLoaded = ref(false);

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
        
    }

</script>
<template>
    <h3>PAX VOLUME</h3>    
    <a @click="loadPaxVolume()">[LOAD]</a>
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