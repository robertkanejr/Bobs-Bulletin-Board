import { createSlice } from "@reduxjs/toolkit";

const initialState = [
	{ id: "0", name: "Luke Skywalker" },
	{ id: "1", name: "Din Djarin" },
	{ id: "2", name: "Jared Dunn" },
	{ id: "3", name: "Logan Roy" },
	{ id: "4", name: "Batman" },
];

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
});

export const selectAllUsers = (state) => state.users;
export default usersSlice.reducer;
