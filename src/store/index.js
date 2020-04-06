import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const fetchItem = function () {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve("item 组件返回ajax数据")
        },1000)
    })
}

export function createStore() {
    const store =  new Vuex.Store({
        state:{
            items:""
        },
        actions:{
            fetchItem({commit}){
                return fetchItem().then(data=>{
                    commit("setItem",data);
                }).catch(err =>{
                    console.log(err)
                })
            }
        },
        mutations:{
            setItem(state, data){
                state.items = data;
            }
        }
    })

    if (typeof window !== "undefined" && window.__INITAL_STATE__){
        console.log('window.__INITIAL_STATE__', window.__INITIAL_STATE__);
        store.replaceState(window.__INITIAL_STATE__);
    }

    return store;
}