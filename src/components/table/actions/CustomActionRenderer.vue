<!-- src/components/customActionRenderer.vue -->
<template>
    <saveButtonComponent v-if="!props.params.data.id" :params="props.params" />
    <deleteButtonComponent v-else :params="props.params" />
</template>

<script setup lang="ts">
import { SaveButtonComponent, DeleteButtonComponent } from "@/components/table/actions";

const props = defineProps<{
    params: {
        data: { id?: number };
        onDeleteRow: (data: unknown) => void;
        onSaveRow: (data: unknown) => void;
    };
}>();
</script>
