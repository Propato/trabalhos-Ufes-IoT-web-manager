import type { IPath } from "@/services/interfaces";
import { useOccupationStore, usePathStore } from "@/stores";

export const getAvailableSlot = (topic: string, gate: string): IPath | null => {
    const pathStore = usePathStore();
    const { hasOccupation, addOccupation } = useOccupationStore();

    let min_path: IPath = {
        slot_length: Infinity,
        full_length: Infinity,
        weighted_length: Infinity,
        gate: gate,
        slot: "",
        entrance: "",
        occupied: true,
        path: [],
    };

    pathStore.paths.forEach((path) => {
        if (path.gate === gate && !hasOccupation(path.slot)) {
            if (path.weighted_length < min_path.weighted_length) {
                min_path = path;
            } else if (
                path.weighted_length === min_path.weighted_length &&
                path.slot_length > min_path.slot_length
            ) {
                min_path = path;
            }
        }
    });

    addOccupation(min_path.slot);

    return min_path;
};
