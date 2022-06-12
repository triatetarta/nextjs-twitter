import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalOpen: false,
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
    setPostId: (state, action) => {
      state.postId = action.payload;
    },
  },
});

export const { setModalOpen, setModalClose, setPostId } = modalSlice.actions;
export default modalSlice.reducer;
