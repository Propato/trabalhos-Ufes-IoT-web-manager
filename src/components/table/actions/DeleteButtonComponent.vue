<template>
    <button class="btn btn-sm btn-danger d-flex align-items-center gap-1" @click="handleDelete">
        <font-awesome-icon :icon="['fas', 'xmark']" class="fa-xl text-white" />
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    params: {
        onDeleteRow: (data: unknown) => void;
        data: unknown;
    };
}>();

const handleDelete = () => {
    props.params.onDeleteRow(props.params.data);
};
</script>
