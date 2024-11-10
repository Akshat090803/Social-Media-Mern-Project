import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "Posts",
  initialState: {
    post: [],
    selectedPost:null,
    postLoading:false
  },

  reducers: {
    setPost: (state, action) => {
      state.post = action.payload;
    },
    //  addPost:(state,action)=>{
    //         state.post=[action.payload,...state.post]
    //  }
    setSelectedPost:(state,action)=>{
                state.selectedPost=action.payload
    },
    deletePost: (state, action) => {
      state.post = state.post.filter((p) => {
        return p._id != action.payload;
      });
    },
    likeDislike: (state, action) => {
      state.post[action.payload.index].likes = action.payload.likes;
    },
    updateComment: (state, action) => {
      state.post[action.payload.index].comments = action.payload.comments;
      state.selectedPost.comments=action.payload.comments
    },
    setLikeDislikeFromSocket:(state,action)=>{
      if (action.payload.type === 'like') {
        return {
          ...state,
          post: state.post.map((item) => {
            if (item._id === action.payload.postId) {
              return {
                ...item,
                likes: [...item.likes, action.payload.likerId],
              };
            }
            return item;
          }),
        };
      } else{

             state.post=state.post.map((item)=>{
              if(item._id === action.payload.postId){
                item.likes=item.likes.filter((liker)=>{
                  return liker!==action.payload.userId
                })
              }
              return item
             })

      }
    },
    setPostLoading:(state,action)=>{
      state.postLoading=action.payload
    }
  },
});

export const {
  setPost,
  addPost,
  deletePost,
  likeDislike,
  updateComment,
  setSelectedPost,
  setLikeDislikeFromSocket,
  setPostLoading
} = postSlice.actions;
export default postSlice.reducer;
