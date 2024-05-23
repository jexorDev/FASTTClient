<script setup lang="ts">
import { ref } from 'vue';
import FlightInformationTerminal from './components/FlightInformationTerminal.vue';
import FlightInformationTable from './components/FlightInformationTable.vue';
import AdminTasks from "./components/AdminTasks.vue";

const selection = ref(0);

</script>

<template>
  <div class="container">
    <div>
      <a @click="selection = 0" :class="selection === 0 ? 'selected' : ''">[TERMINAL]</a>
      <a @click="selection = 1" :class="selection === 1 ? 'selected' : ''">[TABLE]</a>
      <a @click="selection = 2" :class="selection === 2 ? 'selected' : ''">[ALERTS]</a>
      <a @click="selection = 3" :class="selection === 3 ? 'selected' : ''">[STATISTICS]</a>
      <a @click="selection = 4" :class="selection === 4 ? 'selected' : ''">[HELP]</a>
      <a @click="selection = 5" :class="selection === 5 ? 'selected' : ''">[ADMIN]</a>
    </div>
    
    <FlightInformationTerminal v-if="selection === 0"/>
    <FlightInformationTable v-if="selection === 1"/>
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
