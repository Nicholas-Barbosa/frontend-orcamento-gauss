import { createWebHashHistory, createRouter } from "vue-router";
import AuthenService from "./classes/service/AuthenService.js";
import Dashboard from "./components/Dashboard.vue";
import Orcamento from "./components/pedido/Orcamento";
import Login from './components/Login.vue'
export const routes = [
    {
        path: "/dash",
        component: Dashboard,
        titulo: "Dash"

    },



    {
        path: "/:catchAll(.*)",
        component: Dashboard,
    },
    {
        path: "/pedido/novo",
        component: Orcamento,

    },
    {
        path: "/login",
        component: Login
    }

];
const router = createRouter({
    history: createWebHashHistory(),
    routes,

});
router.beforeEach((to, from, next) => {
    if (to.path != '/login' && !AuthenService.isAuthenticated()) {
        next({ path: "/login" });
    } else {
        next();
    }

})
export default router;