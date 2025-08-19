<script setup lang="ts">
import { RouterView } from "vue-router";

import { onMounted, onBeforeUnmount } from "vue";
import { useMqttStore, useOccupationStore, usePathStore } from "@/stores";

const { initializeMqtt, connectMqtt, disconnect } = useMqttStore();

onMounted(async () => {
    const pathStore = usePathStore();
    const occupationStore = useOccupationStore();

    pathStore.paths.forEach((path) => {
        if (path.occupied && !occupationStore.hasOccupation(path.slot)) {
            occupationStore.addOccupation(path.slot, false);
        }
    });

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
