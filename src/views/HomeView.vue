<template>
    <h1>Hello!</h1>

    <p>Welcome to the home page.</p>

    <MessageComponent :messages="viewMessages" />

    <div class="d-flex justify-content-between align-items-center">
        <h3 class="h4">Register your graphs</h3>
        <button class="btn btn-warning mt-2" @click="resetGraph">Reset to Default</button>
    </div>

    <!-- Nav Tabs -->
    <div>
        <ul class="nav nav-tabs mb-3" id="graphTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link active"
                    id="nodes-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nodes"
                    type="button"
                    role="tab"
                    aria-controls="nodes"
                    aria-selected="true"
                >
                    Nodes
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button
                    class="nav-link"
                    id="edges-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#edges"
                    type="button"
                    role="tab"
                    aria-controls="edges"
                    aria-selected="false"
                >
                    Edges
                </button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content" id="graphTabsContent">
            <div
                class="tab-pane fade show active"
                id="nodes"
                role="tabpanel"
                aria-labelledby="nodes-tab"
            >
                <NodeTableComponent />
            </div>
            <div class="tab-pane fade" id="edges" role="tabpanel" aria-labelledby="edges-tab">
                <EdgeTableComponent />
            </div>
        </div>

        <div>
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="h4">Graph Report</h3>
                <button class="btn btn-warning mt-3" @click="calculatePaths">
                    Calculate Paths
                </button>
            </div>

            <div>
                <ul class="nav nav-tabs mb-3" id="graphTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button
                            class="nav-link active"
                            id="nodes-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nodes"
                            type="button"
                            role="tab"
                            aria-controls="nodes"
                            aria-selected="true"
                        >
                            Paths
                        </button>
                    </li>
                </ul>

                <div class="tab-content" id="graphTabsContent">
                    <div
                        class="tab-pane fade show active"
                        id="nodes"
                        role="tabpanel"
                        aria-labelledby="nodes-tab"
                    >
                        <PathTableComponent />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EdgeTableComponent, NodeTableComponent, PathTableComponent } from "@/components/table";
import type { IAlertMessage, IEdge, INode } from "@/utils/interfaces";
import { MessageComponent } from "@/components/functional";
import { useEdgeStore, useNodeStore, usePathStore } from "@/stores";
import { dijkstra, jsonFileToObject } from "@/utils/functions";
import { ref } from "vue";
import { setPath } from "@/utils/functions/path";

const storeEdge = useEdgeStore();
const storeNodes = useNodeStore();
const storePaths = usePathStore();

const viewMessages = ref<IAlertMessage[]>([]);

const resetGraph = async () => {
    viewMessages.value = [];
    let { content, errors } = await jsonFileToObject("db/nodes.json");
    if (errors.length) {
        viewMessages.value.push(...errors);
        return;
    }
    const contentNode = content as INode[];

    ({ content, errors } = await jsonFileToObject("db/edges.json"));
    if (errors.length) {
        viewMessages.value.push(...errors);
        return;
    }
    const contentEdge = content as IEdge[];

    storeNodes.setNode(contentNode);
    storeEdge.setEdge(contentEdge);

    viewMessages.value = [{ message: "Graph reset successfully", type: "warning" }];

    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.reload();
};

const calculatePaths = () => {
    console.log("Click");

    const DG1 = dijkstra("G1", storeNodes.nodes, storeEdge.edges);
    const PG1 = setPath(storeNodes.nodes, storeEdge.edges, DG1.distances, DG1.paths);
    // const DG2 = dijkstra("G2", storeNodes.nodes, storeEdge.edges);
    // const PG2 = setPath(storeNodes.nodes, storeEdge.edges, DG2.distances, DG2.paths);

    // console.log(DG1);
    // console.log(PG1);
    // console.log(DG2);
    // console.log(PG2);

    storePaths.setPath(PG1);

    // viewMessages.value = [{ message: "Paths calculated successfully", type: "warning" }]; // Sending message to the wrong component
    console.log("Finish");
};
</script>

<style scoped>
.nav-link {
    color: var(--bs-warning-text-emphasis);
}

.nav-link.active {
    color: var(--bs-nav-tabs-link-active-color);
}
</style>
