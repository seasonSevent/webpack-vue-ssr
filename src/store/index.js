import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export function createStore() {
    return new Vuex.Store({
        state:{
            items:{}
        },
        actions:{
            fetchItem({commit},id){
                return new Promise((resolve, reject) => {
                    setTimeout(()=>{
                        resolve({id})
                    },500)
                }).then(res =>{
                    commit("setItem",res)
                })
            }
        },
        mutations:{
            setItem(state, {res}){
                Vue.set(state,"items",res)
            }
        }
    })
}