<template>
    <div
        v-for="(message, index) in localMessages"
        :key="index"
        class="alert d-flex justify-content-between align-items-center"
        :class="'alert-' + message.type"
        role="alert"
    >
        <span>{{ message.text || "System Error" }}</span>
        <button
            type="button"
            class="btn-close"
            aria-label="Fechar"
            @click="removeMessage(index)"
        ></button>
    </div>
</template>

<script setup lang="ts">
import type { IAlertMessage } from "@/utils/interfaces";
import { ref, watch } from "vue";

const { messages } = defineProps<{
    messages: IAlertMessage[];
}>();

const localMessages = ref<IAlertMessage[]>([...messages]);

watch(
    () => messages,
    (newMessages) => {
        localMessages.value = [...newMessages];
    },
    { deep: true },
);

function removeMessage(index: number) {
    localMessages.value.splice(index, 1);
}
</script>
