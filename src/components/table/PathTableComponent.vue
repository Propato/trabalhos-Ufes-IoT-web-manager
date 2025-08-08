<template>
    <div class="m-4">
        <MessageComponent :messages="viewMessages" />
        <ag-grid-vue
            class="ag-theme-alpine"
            :rowData="localData"
            :columnDefs="colDefs"
            :pagination="true"
            :paginationPageSize="5"
            :paginationPageSizeSelector="[5, 10, 20]"
            domLayout="autoHeight"
            @grid-ready="onGridReady"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { GridReadyEvent } from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue3";
import { useOccupationStore, usePathStore } from "@/stores";
import type { IAlertMessage } from "@/services/interfaces";
import { MessageComponent } from "@/components/functional";

const storePaths = usePathStore();
const viewMessages = ref<IAlertMessage[]>([]);
const storeOccupation = useOccupationStore();

let localData = storePaths.paths.filter(
    (p) =>
        p.slot_length && p.slot_length !== Infinity && p.full_length && p.full_length !== Infinity,
);

const colDefs = [
    {
        field: "gate",
        headerName: "Gate",
        sortable: true,
        filter: true,
        flex: 1,
    },
    {
        field: "slot",
        headerName: "Slot",
        sortable: true,
        filter: true,
        flex: 1,
    },
    {
        field: "entrance",
        headerName: "Entrance",
        sortable: true,
        filter: true,
        flex: 1,
    },
    {
        field: "slot_length",
        headerName: "Length to Slot",
        sortable: true,
        filter: true,
        flex: 1,
    },
    {
        field: "full_length",
        headerName: "Full Length",
        sortable: true,
        filter: true,
        flex: 1,
    },
    {
        field: "weighted_length",
        headerName: "Weighted Length",
        sortable: true,
        filter: true,
        flex: 1,
    },
    {
        field: "occupied",
        headerName: "Occupied",
        sortable: true,
        filter: true,
        flex: 1,
        cellRenderer: "agCheckboxCellRenderer",
        cellEditor: "agCheckboxCellEditor",
    },
    {
        field: "path",
        headerName: "Path",
        sortable: true,
        filter: true,
        valueFormatter: (params: { value: string[] }) =>
            Array.isArray(params.value) ? params.value.join(" → ") : "No Path",
    },
];

function onGridReady(params: GridReadyEvent) {
    params.api.autoSizeColumns(["path"]);
}

watch(
    () => storeOccupation.occupation,
    (newOccupation) => {
        storePaths.paths.forEach((path) => {
            path.occupied = newOccupation[path.slot] || false;
        });
    },
    { immediate: true, deep: true },
);
watch(
    () => storePaths.paths,
    (newPaths) => {
        localData = newPaths.filter(
            (p) =>
                p.slot_length &&
                p.slot_length !== Infinity &&
                p.full_length &&
                p.full_length !== Infinity,
        );
    },
    { immediate: true, deep: true },
);
</script>
