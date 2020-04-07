import Vue from "vue"
import VueRouter from "vue-router";

Vue.use(VueRouter)

export function createRouter() {
    return new VueRouter({
        mode:"history",
        routes:[
            {
                name:"home",
                path:"/",
                component:() => import("../page/Home")
            },
            {
                name: "about",
                path:"/about",
                component:()=>import("../page/About")
            },
            {
                name:"about-id",
                path:"/about/:id",
                component:()=>import("../page/About"),
            }
        ]
    })
}