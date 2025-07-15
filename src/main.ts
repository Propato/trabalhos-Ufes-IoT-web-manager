import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import App from "./App.vue";
import router from "./router";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Ícones usados (adicione mais conforme necessário)
import {
    faSpinner,
    faCircleUser,
    faEnvelope,
    faXmark,
    faMagnifyingGlass,
    faCircleCheck,
    faPlus,
    faPencil,
    faCertificate,
    faStar,
    faBookmark,
} from "@fortawesome/free-solid-svg-icons";
// import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faLinkedin, faGithub, faGitlab } from "@fortawesome/free-brands-svg-icons";

library.add(
    faLinkedin,
    faGithub,
    faGitlab,
    faSpinner,
    faCircleUser,
    faEnvelope,
    faXmark,
    faMagnifyingGlass,
    faCircleCheck,
    faPlus,
    faPencil,
    faCertificate,
    faStar,
    faBookmark,
);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.mount("#app");
