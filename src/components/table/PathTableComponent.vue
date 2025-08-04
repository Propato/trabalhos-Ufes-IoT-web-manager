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
import { ref, computed } from "vue";
import type { GridReadyEvent } from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue3";
import { usePathStore } from "@/stores";
import type { IAlertMessage } from "@/utils/interfaces";
import { MessageComponent } from "@/components/functional";

const store = usePathStore();
const viewMessages = ref<IAlertMessage[]>([]);

const localData = computed(() =>
    store.paths.filter(
        (p) =>
            p.slot_length &&
            p.slot_length !== Infinity &&
            p.full_length &&
            p.full_length !== Infinity,
    ),
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
</script>
