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
  
export default configureStore({
    reducer: {
        situNum : situNum.reducer
    }
})

export let { setSitu } = situNum.actions