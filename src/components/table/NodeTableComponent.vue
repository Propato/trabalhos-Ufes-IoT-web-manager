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
            style="height: 400px"
        >
        </ag-grid-vue>
    </div>
</template>

<script setup lang="ts">
import CustomActionRenderer from "@/components/table/actions/CustomActionRenderer.vue";
import type { IAlertMessage, INode } from "@/utils/interfaces";
import { MessageComponent } from "@/components";
import { useNodeStore } from "@/stores/nodes";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";

const store = useNodeStore();
const viewMessages = ref<IAlertMessage[]>([]);

const localData = ref<INode[]>([{} as INode, ...store.nodes]);

const deleteRow = (data: INode) => {
    if (!data.id) return;
    try {
        store.deleteNode(data);
        localData.value = [{} as INode, ...store.nodes];
        viewMessages.value = [{ message: "Node deleted successfully", type: "success" }];
    } catch (error) {
        console.error("Error deleting node:", error);
        viewMessages.value = [{ message: "Error deleting node", type: "danger" }];
    }
};

const onCellValueChanged = (params: { data: INode }) => {
    if (!params.data.id) return;
    try {
        store.updateNode(params.data);
        viewMessages.value = [{ message: "Node updated successfully", type: "success" }];
    } catch (error) {
        console.error("Error updating node:", error);
        viewMessages.value = [{ message: "Error updating node", type: "danger" }];
    }
};

const addNode = (data: INode) => {
    if (!data.label || !data.type) {
        viewMessages.value = [{ message: "Label and Type are required", type: "warning" }];
        return;
    }
    if (!data.id) data.id = store.getNextId;

    try {
        store.addNode(data);
        localData.value = [{} as INode, ...store.nodes];

        viewMessages.value = [{ message: "Node added successfully", type: "success" }];
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
            values: ["gate", "path", "slot", "door"],
        },
        sortable: true,
        filter: true,
        flex: 2,
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
