<template>
    <h1>Hello!</h1>

    <p>Welcome to the home page.</p>

    <div class="d-flex justify-content-between align-items-center">
        <h3 class="h4">Register your graphs</h3>
        <button class="btn btn-warning mt-2" @click="resetGraph">
            <LoadingSpinnerComponent
                :loading="loading"
                :size="'md'"
                :color="'dark'"
                class="mx-5 my-1"
            />
            <template v-if="!loading"> Reset to Default </template>
        </button>
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
            <MessageComponent :messages="viewGraphMessages" />
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
                    <LoadingSpinnerComponent
                        :loading="loading"
                        :size="'md'"
                        :color="'dark'"
                        class="mx-5 my-1"
                    />
                    <template v-if="!loading"> Calculate Paths </template>
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
                    <MessageComponent :messages="viewPathsMessages" />
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
import type { IAlertMessage, IEdge, INode } from "@/services/interfaces";
import { useEdgeStore, useNodeStore, usePathStore } from "@/stores";
import { LoadingSpinnerComponent } from "@/components/functional";
import { dijkstra, jsonFileToObject } from "@/services/functions";
import { MessageComponent } from "@/components/functional";
import { formatPath } from "@/services/functions/path";
import { ref } from "vue";

const storeEdge = useEdgeStore();
const storeNodes = useNodeStore();
const storePaths = usePathStore();

const viewGraphMessages = ref<IAlertMessage[]>([]);
const viewPathsMessages = ref<IAlertMessage[]>([]);
const loading = ref<boolean>(false);

const resetGraph = async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 100));

    viewGraphMessages.value = [];
    let { content, errors } = await jsonFileToObject("db/nodes.json");
    if (errors.length) {
        viewGraphMessages.value.push(...errors);
        return;
    }
    const contentNode = content as INode[];

    ({ content, errors } = await jsonFileToObject("db/edges.json"));
    if (errors.length) {
        viewGraphMessages.value.push(...errors);
        return;
    }
    const contentEdge = content as IEdge[];

    storeNodes.setNode(contentNode);
    storeEdge.setEdge(contentEdge);

    viewGraphMessages.value = [{ message: "Graph reset successfully", type: "warning" }];

    loading.value = false;
};

const calculatePaths = async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { distances, paths } = dijkstra(storeNodes.nodes, storeEdge.edges);
    const fullPaths = formatPath(storeNodes.nodes, storeEdge.edges, distances, paths);
    storePaths.setPath(fullPaths);

    viewPathsMessages.value = [{ message: "Paths calculated successfully", type: "warning" }];
    loading.value = false;
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
