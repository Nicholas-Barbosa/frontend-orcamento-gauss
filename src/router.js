import { createWebHashHistory, createRouter } from "vue-router";
import Dashboard from "./components/Dashboard.vue";
import NewPedido from "./components/pedido/NewPedido";
export const routes = [
    {
        path: "/dash",
        component: Dashboard,
        titulo: "Dash",

    },


  
    {
        path: "/:catchAll(.*)",
        component: Dashboard,
    },
    {
        path:"/pedido/novo",
        component: NewPedido
    }

];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;