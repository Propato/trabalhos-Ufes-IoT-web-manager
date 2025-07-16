<!-- src/components/saveButtonComponent.vue -->
<template>
    <button class="btn btn-sm btn-success d-flex align-items-center gap-1 p-2" @click="handleSave">
        <font-awesome-icon :icon="['fas', 'save']" class="text-white" />
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    params: {
        onSaveRow: (data: unknown) => void;
        data: unknown;
    };
}>();

const handleSave = () => {
    props.params.onSaveRow(props.params.data);
};
</script>
