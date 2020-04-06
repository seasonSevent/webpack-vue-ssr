import {createApp} from "./app";

export default context =>{
    return new Promise((resolve, reject) => {
        const {app,router,store} = createApp()

        //设置服务端router的位置
        router.push(context.url)

        // 等到router讲可能的异步组件和钩子函数解析完
        router.onReady(()=>{
            const matchedComponents = router.getMatchedComponents();

            // 匹配不到的路由没执行reject函数，并返回404
            if (!matchedComponents.length){
                return reject({code:404})
            }

            Promise.all(matchedComponents.map(Component =>{
                if (Component.asyncData){
                    return Component.asyncData({
                        store,
                        router:router.currentRoute
                    })
                }
            })).then(()=>{
                context.state = store.state
                resolve(app)
            }).catch(reject)
        },reject)

    })

}