export type TDistance = {
    [key: string]: number;
};

export type TPath = {
    [key: string]: string | null;
};

export type TAllDistance = {
    [key: string]: TDistance;
};

export type TAllPath = {
    [key: string]: TPath;
};
export type TFullPath = {
    [key: string]: {
        [key: string]: string[];
    };
};
