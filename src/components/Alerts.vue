<script setup lang="ts">
import {defineProps} from "vue";

const props = defineProps<{
  alerts: string[]  
}>()

</script>
<template>

<div v-for="alert of props.alerts">
    <div v-text="alert"></div>
</div>

</template>