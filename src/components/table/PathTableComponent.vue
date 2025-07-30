<template>
    <div class="m-4">
        <MessageComponent :messages="viewMessages" />
        <ag-grid-vue
            :rowData="localData"
            :columnDefs="colDefs"
            :pagination="true"
            :paginationPageSize="5"
            :paginationPageSizeSelector="[5, 10, 20]"
            style="height: 400px"
        >
        </ag-grid-vue>
    </div>
</template>

<script setup lang="ts">
import type { IAlertMessage } from "@/utils/interfaces";
import { MessageComponent } from "@/components/functional";
import { usePathStore } from "@/stores";
import { AgGridVue } from "ag-grid-vue3";
import { ref, computed } from "vue";

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
        flex: 2,
    },
    {
        field: "slot",
        headerName: "Slot",
        sortable: true,
        filter: true,
        flex: 2,
    },
    {
        field: "entrance",
        headerName: "Entrance",
        sortable: true,
        filter: true,
        flex: 2,
    },
    {
        field: "slot_length",
        headerName: "Length to Slot",
        sortable: true,
        filter: true,
        flex: 2,
    },
    {
        field: "full_length",
        headerName: "Full Length",
        sortable: true,
        filter: true,
        flex: 2,
    },
    {
        field: "path",
        headerName: "Path",
        sortable: true,
        filter: true,
        flex: 2,
        valueFormatter: (params: { value: string[] }) => {
            return Array.isArray(params.value) ? params.value.join(" → ") : "No Path";
        },
    },
];
</script>
