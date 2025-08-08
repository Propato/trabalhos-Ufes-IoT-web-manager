import { useOccupationStore } from "@/stores";

export const freeSlot = (slotLabel: string): void => {
    const { hasOccupation, deleteOccupation } = useOccupationStore();

    if (!slotLabel) {
        // console.error(`[Request] Invalid slot label: ${slotLabel}`);
        return;
    }
    if (!hasOccupation(slotLabel)) {
        // console.error(`[Request] Slot not occupied: ${slotLabel}`);
        return;
    }

    deleteOccupation(slotLabel);
};
