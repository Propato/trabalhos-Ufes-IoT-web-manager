import type { IAlertMessage } from "@/services/interfaces";

export const jsonFileToObject = async (
    file: string,
): Promise<{
    content: object;
    errors: IAlertMessage[];
}> => {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            return {
                content: {},
                errors: [{ message: `HTTP error! status: ${response.status}`, type: "danger" }],
            };
        }
        const content = await response.json();
        return { content, errors: [] };
    } catch (error) {
        console.error("Error loading JSON file:", error);
        return {
            content: {},
            errors: [{ message: `Failed to load JSON file: ${file}`, type: "danger" }],
        };
    }
};
