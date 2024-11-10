import { createSlice } from "@reduxjs/toolkit";





const searchPageSlice=createSlice({
    name:'search',
    initialState:{
      searchActive:false,
      recentSearches:[]
    },
    reducers:{
      setSearchActive:(state,action)=>{
           if(action.payload===false){
            state.searchActive=action.payload
           }
           else{
            state.searchActive=!state.searchActive
           }

      },
      setrecentSearches:(state,action)=>{
     
        state.recentSearches=[action.payload,...state.recentSearches ]
      },
      setrecentSearchesIfUserAlreadyTheir:(state,action)=>{
              const temp=state.recentSearches.filter((ele)=>{return ele._id!==action.payload._id})
              temp.unshift(action.payload)
              return{
                ...state,recentSearches:temp
              }
      },
      setRemoveFromRecentSearches:(state,action)=>{
         if(action.payload.type==='single'){
          state.recentSearches=state.recentSearches.filter((item)=>{
            return item._id!==action.payload.id
          })

         }
         if(action.payload.type==='all'){
                           state.recentSearches=[]
         }
      }
    }
})

export const {setSearchActive,setrecentSearches,setRemoveFromRecentSearches,setrecentSearchesIfUserAlreadyTheir}=searchPageSlice.actions
export default searchPageSlice.reducer