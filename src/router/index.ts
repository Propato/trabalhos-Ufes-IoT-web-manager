import { createRouter, createWebHistory } from "vue-router";
import { HomeView, AboutView } from "@/views";

import { DefaultLayout } from "@/layouts";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: DefaultLayout,
            children: [
                { path: "", name: "Home", component: HomeView },
                { path: "/about", name: "About", component: AboutView },
            ],
        },
    ],
});

export default router;
