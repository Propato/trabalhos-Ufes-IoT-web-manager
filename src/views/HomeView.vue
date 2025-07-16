<template>
    <h1>Hello</h1>

    <p>Welcome to the home page!</p>
    <p>Please, register your graphs.</p>

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
    </div>
</template>

<script setup lang="ts">
import EdgeTableComponent from "@/components/table/EdgeTableComponent.vue";
import NodeTableComponent from "@/components/table/NodeTableComponent.vue";
</script>

<style scoped>
.nav-link {
    color: var(--bs-warning-text-emphasis);
}

.nav-link.active {
    color: var(--bs-nav-tabs-link-active-color);
}
</style>
