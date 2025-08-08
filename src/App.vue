<script setup lang="ts">
import { RouterView } from "vue-router";

import { onMounted, onBeforeUnmount } from "vue";
import { useMqttStore } from "@/stores";

const { initializeMqtt, connectMqtt, disconnect } = useMqttStore();

onMounted(async () => {
    await initializeMqtt();
    connectMqtt();
});

onBeforeUnmount(() => {
    disconnect();
});
</script>

<template>
    <RouterView class="bg-dark-subtle min-vh-100" />
</template>
