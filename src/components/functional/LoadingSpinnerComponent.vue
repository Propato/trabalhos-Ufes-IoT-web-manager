<template>
    <div v-if="loading" class="d-flex justify-content-center align-items-center m-3">
        <font-awesome-icon
            :icon="['fas', 'spinner']"
            spin
            :class="[sizeClass, colorClass]"
            role="status"
            aria-label="Loading"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const { size, color, loading } = defineProps({
    size: {
        type: String,
        default: "lg",
        // required: false,
        validator(value: string) {
            return ["sm", "md", "lg", "xl"].includes(value)
        },
    },
    color: {
        type: String,
        default: "primary",
        // required: false,
        validator(value: string) {
            return [
                "primary",
                "secondary",
                "success",
                "danger",
                "warning",
                "info",
                "light",
                "dark",
            ].includes(value)
        },
    },
    loading: Boolean,
})

const sizeClass = computed(() => {
    switch (size) {
        case "sm":
            return "fa-xs"
        case "md":
            return "fa-lg"
        case "lg":
            return "fa-2x"
        case "xl":
            return "fa-3x"
        default:
            return "fa-lg"
    }
})

const colorClass = computed(() => {
    return color ? `text-${color}` : "text-primary"
})
</script>
