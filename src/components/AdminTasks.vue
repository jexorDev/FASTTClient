<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { getDateTimeFromString } from '../utility/DateTimeUtility';

const loading = ref(false);
const status = ref("");

const timeFrom = ref("00:00");
const timeTo = ref("23:59");

const day = ref(0);
const adminPass = ref("");

const arrivedFlights = ref(true);
const arrivingFlights = ref(true);

const departedFlights = ref(true);
const departingFlights = ref(true);

function load() {
    loading.value = true;
    status.value = "";

    const fromDate = getDateTimeFromString(timeFrom.value);
    const toDate = getDateTimeFromString(timeTo.value);
    const dateOffset = day.value;
    
    fromDate.setDate(fromDate.getDate() + dateOffset);
    toDate.setDate(toDate.getDate() + dateOffset);    

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/FlightData`,
    {
        "fromDateTime": fromDate.toISOString(),
        "toDateTime": toDate.toISOString(),
        "adminPassword": adminPass.value,
        "arrived": arrivedFlights.value,
        "scheduledArriving": arrivingFlights.value,
        "departed": departedFlights.value,
        "scheduledDeparting": departingFlights.value
    }).then((response) => status.value = response.data)
        .catch((ex) => status.value = ex)
        .finally(() => loading.value = false);
}
</script>
<template>   

    <div style="margin-top: 10px;">
        <div>Load data for:</div>
        <input type="radio" id="today" name="day" value="0" @input="day = 0"> 
        <label for="today">Today</label>
        
        <input type="radio" id="tomorrow" name="day" value="1" @input="day = 1"> 
        <label for="tomorrow">Tomorrow</label>

    </div>

    <div>
        <input v-model="timeFrom" type="text" placeholder="00:00" style="width:100px">
        <input v-model="timeTo" type="text" placeholder="23:59" style="width:100px">
    </div>

    <div style="margin-top: 10px;">
        <input v-model="arrivedFlights" type="checkbox" style="display: inline;" />
        <div style="display: inline;">Arrived Flights</div>
    </div>
    <div>
        <input v-model="arrivingFlights" type="checkbox" style="display: inline;" />
        <div style="display: inline;">Scheduled Arriving Flights</div>
    </div>
    <div>
        <input v-model="departedFlights" type="checkbox" style="display: inline;" />
        <div style="display: inline;">Departed Flights</div>
    </div>
    <div>
        <input v-model="departingFlights" type="checkbox" style="display: inline;" />
        <div style="display: inline;">Scheduled Departing Flights</div>
    </div>

    <div style="margin-top: 10px;">
        <label for="adminPass">Admin Password</label>
        <input v-model="adminPass" type="password" id="adminPass" style="margin-left: 5px;"/>
    </div>

    <button style="margin-top: 10px;" @click="load">{{ loading ? "LOADING..." : "LOAD" }}</button>

    <div style="margin-top: 20px;" v-show="status">STATUS:</div>
    <div v-text="status"></div>
</template>