<template>
    <div class="d-flex flex-column min-vh-100">
        <NavHeaderComponent />
        <main class="container flex-grow-1">
            <RouterView />
        </main>
        <FooterComponent />
    </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { NavHeaderComponent, FooterComponent } from "@/components";
</script>
