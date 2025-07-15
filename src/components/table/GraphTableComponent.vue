<template>
    <div class="m-4">
        <ag-grid-vue
            :rowData="store.nodes"
            :columnDefs="colDefs"
            :pagination="true"
            :paginationPageSize="5"
            :paginationPageSizeSelector="[5, 10, 20]"
            :components="{ deleteButtonComponent }"
            style="height: 400px"
        >
        </ag-grid-vue>
    </div>
</template>

<script setup lang="ts">
import deleteButtonComponent from "./deleteButtonComponent.vue";
import { useNodeStore } from "@/stores/nodes";
import type { INode } from "@/utils/interfaces";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";

const store = useNodeStore();

const deleteRow = (nodeData: INode) => {
    store.deleteNodeByLabel(nodeData.label);
};

const colDefs = ref([
    { field: "label", editable: true },
    {
        field: "type",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: ["gate", "path", "slot", "door"],
        },
    },
    {
        field: "actions",
        headerName: "Ações",
        cellRenderer: deleteButtonComponent,
        cellRendererParams: {
            onDeleteRow: deleteRow,
        },
        sortable: false,
        filter: false,
        width: 100,
    },
]);
</script>
