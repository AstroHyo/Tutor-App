import { configureStore, createSlice } from '@reduxjs/toolkit'

let situNum = createSlice({
    name : 'situNum',
    initialState : 1,
    reducers : {
        setSitu(num){
            return num
        }
    }
  })
  
  export default configureStore({
    reducer: {
        situNum : situNum.reducer
    }
  })

  export let { setSitu } = situNum.actions