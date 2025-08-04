<template>
    <div class="m-4">
        <MessageComponent :messages="viewMessages" />
        <ag-grid-vue
            :rowData="localData"
            :columnDefs="colDefs"
            :pagination="true"
            :paginationPageSize="5"
            :paginationPageSizeSelector="[5, 10, 20]"
            :components="{ CustomActionRenderer }"
            @cellValueChanged="onCellValueChanged"
            domLayout="autoHeight"
        >
        </ag-grid-vue>
    </div>
</template>

<script setup lang="ts">
import { CustomActionRenderer } from "@/components/table/actions";
import type { IAlertMessage, IEdge } from "@/utils/interfaces";
import { MessageComponent } from "@/components/functional";
import { useEdgeStore, useNodeStore } from "@/stores";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";

const store = useEdgeStore();
const storeNodes = useNodeStore();
const viewMessages = ref<IAlertMessage[]>([]);

const localData = ref<IEdge[]>([{} as IEdge, ...store.edges]);

const deleteRow = (data: IEdge) => {
    if (!data.id) return;
    try {
        store.deleteEdge(data);
        localData.value = [{} as IEdge, ...store.edges];
        viewMessages.value = [{ message: "Edge deleted successfully", type: "warning" }];
    } catch (error) {
        console.error("Error deleting edge:", error);
        viewMessages.value = [{ message: "Error deleting edge", type: "danger" }];
    }
};

const onCellValueChanged = (params: { data: IEdge }) => {
    if (!params.data.id) return;
    try {
        store.updateEdge(params.data);
        viewMessages.value = [{ message: "Edge updated successfully", type: "warning" }];
    } catch (error) {
        console.error("Error updating edge:", error);
        viewMessages.value = [{ message: "Error updating edge", type: "danger" }];
    }
};

const addEdge = (data: IEdge) => {
    if (!data.length || !data.source || !data.target) {
        viewMessages.value = [{ message: "Source, Target and Length are required", type: "info" }];
        return;
    }
    if (!data.id) data.id = store.getNextId;

    try {
        store.addEdge(data);
        localData.value = [{} as IEdge, ...store.edges];

        viewMessages.value = [{ message: "Edge added successfully", type: "warning" }];
    } catch (error) {
        console.error("Error adding edge:", error);
        viewMessages.value = [{ message: "Error adding edge", type: "danger" }];
    }
};

const colDefs = [
    { field: "id", headerName: "Id", sortable: true, filter: true, flex: 1 },
    {
        field: "source",
        headerName: "Source",
        editable: true,
        sortable: true,
        filter: true,
        flex: 2,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: [...storeNodes.nodes.map((node) => node.label)],
        },
    },
    {
        field: "target",
        headerName: "Target",
        editable: true,
        sortable: true,
        filter: true,
        flex: 2,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: [...storeNodes.nodes.map((node) => node.label)],
        },
    },
    {
        field: "length",
        headerName: "Length",
        editable: true,
        sortable: true,
        filter: true,
        flex: 2,
    },
    {
        field: "active",
        headerName: "Active",
        editable: true,
        sortable: true,
        filter: true,
        flex: 1,
        cellRenderer: "agCheckboxCellRenderer",
        cellEditor: "agCheckboxCellEditor",
    },
    {
        field: "actions",
        headerName: "Actions",
        cellRenderer: "CustomActionRenderer",
        cellRendererParams: (params: { data: IEdge }) => ({
            data: params.data,
            onSaveRow: addEdge,
            onDeleteRow: deleteRow,
        }),
        sortable: false,
        filter: false,
        flex: 1,
        cellStyle: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    },
];
</script>
