<template>
    <header class="mb-4">
        <nav
            class="p-3 navbar navbar-expand-lg navbar-light bg-warning-subtle text-warning-emphasis"
        >
            <div class="container">
                <!-- Logo -->
                <RouterLink class="navbar-brand" to="/">
                    <!-- <img src="@/assets/logo.png" alt="IoT" height="60" /> -->
                    <span class="h3">IoT Manager</span>
                </RouterLink>

                <!-- Toggler -->
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Conteúdo da navbar -->
                <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <!-- Links centralizados -->
                    <ul class="navbar-nav mx-auto d-lg-none">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">
                                <span class="h4">Home</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/about">
                                <span class="h4">About</span>
                            </RouterLink>
                        </li>
                    </ul>

                    <!-- Opções do usuário (somente para telas grandes) -->
                    <ul
                        class="navbar-nav ms-auto d-none d-lg-flex justify-content-center align-items-center"
                    >
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">
                                <span class="h4">Home</span>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/about">
                                <span class="h4">About</span>
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.navbar-nav .nav-link {
    cursor: pointer;
}
h3 {
    margin: 0;
}
</style>
