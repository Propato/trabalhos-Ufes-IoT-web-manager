<!-- src/components/deleteButtonComponent.vue -->
<template>
    <button class="btn btn-sm btn-danger d-flex align-items-center gap-1" @click="confirmAndDelete">
        <font-awesome-icon :icon="['fas', 'xmark']" class="fa-xl text-white" />
    </button>
</template>

<script setup lang="ts">
import type { INode } from "@/utils/interfaces";

const props = defineProps<{
    params: {
        onDeleteRow: (data: INode) => void;
        node: { data: INode };
    };
}>();

function confirmAndDelete() {
    if (confirm("Tem certeza que deseja remover esta linha?")) {
        props.params.onDeleteRow(props.params.node.data);
    }
}
</script>
