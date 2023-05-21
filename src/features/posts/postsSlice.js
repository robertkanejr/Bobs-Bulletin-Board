import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const initialState = [
	{
		id: "1",
		title: "The Mandalorian Creed",
		content: "This is the way.",
		date: sub(new Date(), { minutes: randomNumber(1, 30) }).toISOString(),
		userId: "1",
		reactions: {
			thumbsUp: 0,
			wow: 0,
			heart: 0,
			rocket: 0,
			funny: 0,
		},
	},
	{
		id: "2",
		title: "Things You Will Never Hear Me Say",
		content: "Save me Superman!",
		date: sub(new Date(), { minutes: randomNumber(30, 60) }).toISOString(),
		userId: "4",
		reactions: {
			thumbsUp: 0,
			wow: 0,
			heart: 0,
			rocket: 0,
			funny: 0,
		},
	},
	{
		id: "3",
		title: "Thoughts on Homeownership",
		content:
			"I simply pretend that my skeleton is me and my body is my house, and that way, I’m always home!.",
		date: sub(new Date(), { minutes: randomNumber(60, 100) }).toISOString(),
		userId: "2",
		reactions: {
			thumbsUp: 0,
			wow: 0,
			heart: 0,
			rocket: 0,
			funny: 0,
		},
	},

	{
		id: "4",
		title: "My Life Philosophy",
		content: "The future is real. The past is all made up.",
		date: sub(new Date(), { minutes: randomNumber(100, 300) }).toISOString(),
		userId: "3",
		reactions: {
			thumbsUp: 0,
			wow: 0,
			heart: 0,
			rocket: 0,
			funny: 0,
		},
	},

	{
		id: "5",
		title: "Jedi Blessings",
		content: "May the force be with you.",
		date: sub(new Date(), { minutes: randomNumber(300, 500) }).toISOString(),
		userId: "0",
		reactions: {
			thumbsUp: 0,
			wow: 0,
			heart: 0,
			rocket: 0,
			funny: 0,
		},
	},
];

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		postAdded: {
			reducer(state, action) {
				state.push(action.payload);
			},
			prepare(title, content, userId) {
				return {
					payload: {
						id: nanoid(),
						title,
						content,
						date: new Date().toISOString(),
						userId,
						reactions: {
							thumbsUp: 0,
							wow: 0,
							heart: 0,
							rocket: 0,
							funny: 0,
						},
					},
				};
			},
		},
		reactionAdded(state, action) {
			const { postId, reaction } = action.payload;
			const existingPost = state.find((post) => post.id === postId);
			if (existingPost) existingPost.reactions[reaction]++;
		},
	},
});

export const selectAllPosts = (state) => state.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
