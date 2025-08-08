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
import type { IAlertMessage, INode } from "@/services/interfaces";
import { MessageComponent } from "@/components/functional";
import { useNodeStore } from "@/stores/nodes";
import { AgGridVue } from "ag-grid-vue3";
import { ref, watch } from "vue";

const store = useNodeStore();
const viewMessages = ref<IAlertMessage[]>([]);

const localData = ref<INode[]>([{} as INode, ...store.nodes]);

watch(
    () => store.nodes,
    (nodes) => {
        localData.value = [{} as INode, ...nodes];
    },
    { immediate: true, deep: true },
);

const deleteRow = (data: INode) => {
    if (!data.id) return;
    try {
        store.deleteNode(data);
        localData.value = [{} as INode, ...store.nodes];
        viewMessages.value = [{ message: "Node deleted successfully", type: "warning" }];
    } catch (error) {
        console.error("Error deleting node:", error);
        viewMessages.value = [{ message: "Error deleting node", type: "danger" }];
    }
};

const onCellValueChanged = (params: { data: INode }) => {
    if (!params.data.id) return;
    try {
        store.updateNode(params.data);
        viewMessages.value = [{ message: "Node updated successfully", type: "warning" }];
    } catch (error) {
        console.error("Error updating node:", error);
        viewMessages.value = [{ message: "Error updating node", type: "danger" }];
    }
};

const addNode = (data: INode) => {
    if (!data.label || !data.type) {
        viewMessages.value = [{ message: "Label and Type are required", type: "info" }];
        return;
    }
    if (!data.id) data.id = store.getNextId;

    try {
        store.addNode(data);
        localData.value = [{} as INode, ...store.nodes];

        viewMessages.value = [{ message: "Node added successfully", type: "warning" }];
    } catch (error) {
        console.error("Error adding node:", error);
        viewMessages.value = [{ message: "Error adding node", type: "danger" }];
    }
};

const colDefs = [
    { field: "id", headerName: "Id", sortable: true, filter: true, flex: 1 },
    {
        field: "label",
        headerName: "Label",
        editable: true,
        sortable: true,
        filter: true,
        flex: 2,
    },
    {
        field: "type",
        headerName: "Type",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
            values: ["gate", "path", "slot", "entrance"],
        },
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
        cellRendererParams: (params: { data: INode }) => ({
            data: params.data,
            onSaveRow: addNode,
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
