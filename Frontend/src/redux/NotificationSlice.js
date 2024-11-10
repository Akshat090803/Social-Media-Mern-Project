import { createSlice } from "@reduxjs/toolkit";

const NotificationSlice = createSlice({
  name: "notifications",
  initialState: {
    likeCommentFollowNotifications: [],
    messageNotifications: [],
    NotificationActive:false,
    showLikeNotifcationBadge:false,
    showMessageNotificationBadge:0
  },
  reducers: {
    setLikeCommentFollowNotifications: (state, action) => {
      if ((action.payload.type === "like" || action.payload.type === "addComment" )|| action.payload.type==='follow' ) {
        state.likeCommentFollowNotifications=[action.payload,...state.likeCommentFollowNotifications];
      }

      if (action.payload.type === "dislike") {
        
        state.likeCommentFollowNotifications =
          state.likeCommentFollowNotifications.filter((item) => { return (item.likerId !== action.payload.userId || item.post._id !== action.payload.post._id) });

        
      }
      if (action.payload.type === "deleteComment") {
        state.likeCommentFollowNotifications =
          state.likeCommentFollowNotifications.filter((item) => { return item?.commentId !== action?.payload.commentId});
      }

      if(action.payload.type==='unfollow'){
        state.likeCommentFollowNotifications =
        state.likeCommentFollowNotifications.filter((item) => { return item?.followingId !== action?.payload.userId})
      }
    },

    setNotificationActive:(state,action)=>{
      if(action.payload===false){
        state.NotificationActive=action.payload
      }
      else{
        state.NotificationActive=!state.NotificationActive
      }
     
    },
    setLikeNotificationBadge:(state,action)=>{
      state.showLikeNotifcationBadge=action.payload
    },
    setMessageNotifications:(state,action)=>{
                //  state.messageNotifications=[...state.messageNotifications,action.payload]
                 const temp=[...state.messageNotifications,action.payload]
                 const unique=[...new Set(temp)]
                 return {
                  ...state,messageNotifications:unique
                 }
    },



    setMessageNotificationsRemove:(state,action)=>{
      state.messageNotifications=state.messageNotifications.filter((item)=>{
        return item!==action.payload
      })
    },

    setMessageNotificationFromDb:(state,action)=>{
      state.messageNotifications=action.payload
    },
    setLikeCommentFollowNotificationsFromDb:(state,action)=>{
      state.likeCommentFollowNotifications=action.payload
    }
  },
});

export const {setLikeCommentFollowNotifications,setNotificationActive,setLikeNotificationBadge,setMessageNotifications,setMessageNotificationsRemove,setMessageNotificationFromDb,setLikeCommentFollowNotificationsFromDb}=NotificationSlice.actions
export default NotificationSlice.reducer