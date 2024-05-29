<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import FlightInformationTerminal from './components/FlightInformationTerminal.vue';
import FlightInformationTable from './components/FlightInformationTable.vue';
import AdminTasks from "./components/AdminTasks.vue";
import Alerts from "./components/Alerts.vue";

import axios from 'axios';
import AirlineAlert from './models/AirlineAlert';
import { formatDateTimeToString } from './utility/DateTimeUtility';

const selection = ref(0);
let intervalId = 0;
const alerts = ref<AirlineAlert[]>([]);
const currentTime = ref(new Date(Date.now()));

onMounted(async () => {
  intervalId = setInterval(async() => {
    await pollAlerts()
  }, 60000);
});

onBeforeUnmount(() => clearInterval(intervalId));

async function pollAlerts() {
  currentTime.value = new Date(Date.now());

  const from = new Date();
  const to = new Date();
  to.setHours(from.getHours() + 1);
  
  axios.get(`${import.meta.env.VITE_API_BASE_URL}/Alerts?fromDateTime=${from.toISOString()}&toDateTime=${to.toISOString()}`).then((response) => {
    alerts.value = response.data;  
  });

}

const alertCount = computed<number>(() => {
  return alerts.value.length
})

</script>

<template>
  <div class="container">
    <div>
      
      <a @click="selection = 1" :class="selection === 1 ? 'selected' : ''">[SEARCH]</a>
      <a @click="selection = 2" :class="selection === 2 ? 'selected' : ''">[ALERTS ({{ alertCount }})]</a>
      <a @click="selection = 3" :class="selection === 3 ? 'selected' : ''">[STATISTICS]</a>
      <a @click="selection = 4" :class="selection === 4 ? 'selected' : ''">[HELP]</a>
      <a @click="selection = 5" :class="selection === 5 ? 'selected' : ''">[ADMIN]</a>
      <div style="float: right;">
        <div>{{ formatDateTimeToString(currentTime) }}</div>
      </div>
    </div>
    
    <FlightInformationTerminal v-if="selection === 0"/>
    <FlightInformationTable v-if="selection === 1"/>
    <Alerts v-if="selection === 2" :airlineAlerts="alerts"/>
    <AdminTasks v-if="selection === 5"/>
  </div>
</template>

<style scoped>
.container {
  position:absolute;
  height: 100%;
  width: 100%;
}
</style>
