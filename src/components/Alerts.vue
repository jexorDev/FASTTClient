<script setup lang="ts">
import {defineProps} from "vue";
import AirlineAlert from "../models/AirlineAlert";
import { buildFlightAwareLink } from "../utility/FlightInfoUtility";
import { formatDateTimeToString } from "../utility/DateTimeUtility";

const props = defineProps<{
  airlineAlerts: AirlineAlert[]  
}>()

</script>
<template>

<table>
  <tr v-for="alert of props.airlineAlerts">
        <td><a :href="buildFlightAwareLink(alert.airlineCode, alert.flightNumber)" target="_blank">{{ alert.airlineCode }}{{ alert.flightNumber }}</a></td>
        <td>{{ alert.airline }}</td>
        <td>{{ (alert.disposition ? "ARRIVING FROM" : "DEPARTING TO") }} {{ alert.cityAirportCode }}-{{ alert.cityAirportName }}</td>
        <td>EXPECTED AT {{ formatDateTimeToString(alert.expectedDateTime) }}</td>

      </tr>
</table>

</template>