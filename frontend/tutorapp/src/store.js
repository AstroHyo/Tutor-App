import { configureStore, createSlice } from '@reduxjs/toolkit'

let situNum = createSlice({
    name : 'situNum',
    initialState : null,
    reducers : {
        setSitu(state, action){
            return action.payload
        }
    }
})

let userSituation = createSlice({
    name : 'userSituation',
    initialState : null,
    reducers : {
        setUserSituation(state, action){
            return action.payload
        }
    }
})

const store = configureStore({//root reducer
    reducer: {situNum: situNum.reducer, userSituation:userSituation.reducer}
});
  
export default store;

export let { setSitu } = situNum.actions
export let { setUserSituation } = userSituation.actions