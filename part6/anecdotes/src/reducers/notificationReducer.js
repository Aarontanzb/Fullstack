import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    voteNotif(state, action) {
      return `you voted '${action.payload}'`
    },
    createNotif(state, action) {
      return `you created '${action.payload}'`
    },
    removeNotification(state, action) {
      return ''
    },
  },
})

export default notificationSlice.reducer
export const { voteNotif, createNotif, removeNotification } =
  notificationSlice.actions
