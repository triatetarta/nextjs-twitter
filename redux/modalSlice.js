import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalOpen: false,
  emojiModalOpen: false,
  postId: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalOpen: (state) => {
      state.modalOpen = true;
    },
    setModalClose: (state) => {
      state.modalOpen = false;
    },
    setEmojiModalOpen: (state) => {
      state.emojiModalOpen = true;
    },
    setEmojiModalClose: (state) => {
      state.emojiModalOpen = false;
    },
    setPostId: (state, action) => {
      state.postId = action.payload;
    },
  },
});

export const {
  setModalOpen,
  setModalClose,
  setPostId,
  setEmojiModalOpen,
  setEmojiModalClose,
} = modalSlice.actions;
export default modalSlice.reducer;
