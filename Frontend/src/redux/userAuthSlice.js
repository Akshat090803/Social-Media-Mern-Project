import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";


const authSlice=createSlice({
  name:'auth',
  initialState:{
    user:null,
    suggestedUser:[],
    userProfile:null,
    selectedUser:null,
    scrollPosition:0
  },
  reducers:{
    setScrollPosition:(state,action)=>{
      state.scrollPosition=action.payload
    }
    ,
    setAuthUser:(state,action)=>{
      state.user=action.payload
    },
    logOutUser:(state)=>{
      state.user=null
    },
    updateBookmark:(state,action)=>{
      state.user.bookmarks=action.payload
    },
    setSuggestedUser:(state,action)=>{
      state.suggestedUser=action.payload
    },
    setUserProfile:(state,action)=>{
      state.userProfile=action.payload
    },
    setSelectedUser:(state,action)=>{
      state.selectedUser=action.payload
    },
    setFollowing:(state,action)=>{

      //!this two cases are for profile page
         if(action.payload.type==='follow'){
          const userProfileFolloweArr=state.userProfile.followers
          state.userProfile.followers=[...userProfileFolloweArr,action.payload.followinguser]
          state.user.following=[...state.user.following,action.payload.userProfileId]
         }
         if(action.payload.type==='unfollow'){
        
          state.userProfile.followers= state.userProfile.followers.filter((item)=>{
            return item._id!==action.payload.followinguser._id
          })
          state.user.following=state.user.following.filter((item)=>{
            return item!==action.payload.userProfileId
          })
         }
         //!this if for right side bar and three dot and comment dialog
         if(action.payload.type==='rightSidebar'){

          if(action.payload.action==='follow'){
            state.user.following=[...state.user.following,action.payload.id]
                    
                     
          }else {
            state.user.following=state.user.following.filter((item)=>{
              return item!==action.payload.id
          })
        }
         
        }
         
    },

    setFollowingFromSocket:(state,action)=>{
                       if(action.payload.type==='follow'){
                           state.user.followers=[...state.user.followers,action.payload.followingId]
                       }
                       if(action.payload.type==='unfollow'){
                        state.user.followers=state.user.followers.filter((item)=>{
                          return item!==action.payload.userId
                        })
                       }
    },
    setMessageNotificationsForUser:(state,action)=>{
      //  state.messageNotifications=[...state.messageNotifications,action.payload]
       const temp=[...state.user.messageNotifications,action.payload]
       const unique=[...new Set(temp)]
       state.user.messageNotifications=unique
       
},
setMessageNotificationsRemoveFromUser:(state,action)=>{
  state.user.messageNotifications=state.user.messageNotifications.filter((item)=>{
    return item!==action.payload
  })
},
  }
})

export const {setAuthUser,logOutUser,updateBookmark,setSuggestedUser,setUserProfile,setSelectedUser,setFollowing,setFollowingFromSocket,setMessageNotificationsForUser,setMessageNotificationsRemoveFromUser,setScrollPosition}=authSlice.actions
export default authSlice.reducer