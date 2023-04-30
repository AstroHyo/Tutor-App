import { configureStore } from '@reduxjs/toolkit'

let chatSitu = createSlice({
    name : 'chatSitu',
    initialState : 0,
    reducers : {
        setSitu(num){
            return num
        }
    }
  })
  
  export default configureStore({
    reducer: {
        chatSitu : chatSitu.reducer
    }
  })

  export let { setSitu } = chatSitu.actions