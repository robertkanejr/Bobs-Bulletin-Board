import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
	posts: [],
	status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
	error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	const response = await axios.get(POSTS_URL);
	return response.data;
});

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost) => {
	const response = await axios.post(POSTS_URL, initialPost);
	return response.data;
});

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		postAdded: {
			reducer(state, action) {
				state.posts.push(action.payload);
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
			const existingPost = state.posts.find((post) => post.id === postId);
			if (existingPost) {
				existingPost.reactions[reaction]++;
			}
		},
	},
	//builder param is an object that allows for add'l case reducers that run in response to actions defined in the slice
	extraReducers(builder) {
		builder
			.addCase(fetchPosts.pending, (state, action) => {
				state.status = "loading";
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = "succeeded";
				//Adding date and reactions to the posts
				let min = 1;
				const loadedPosts = action.payload.map((post) => {
					post.date = sub(new Date(), { minutes: min++ }).toISOString();
					post.reactions = {
						thumbsUp: 0,
						wow: 0,
						heart: 0,
						rocket: 0,
						funny: 0,
					};
					return post;
				});
				//add any fetched posts to the array
				state.posts = state.posts.concat(loadedPosts);
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(addNewPost.fulfilled, (state, action) => {
				//------BUG FIX FOR API POST IDS------
				//creating sortedPosts and assigning the ID
				//Only needed because the API doesn't return accurate new post IDs
				const sortedPosts = state.posts.sort((a, b) => {
					if (a.id > b.id) return 1;
					if (a.id < b.id) return -1;
					return 0;
				});
				action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
				//------END BUG FIX------

				//convert userId to a number
				action.payload.userId = Number(action.payload.userId);
				//add date and reactions to the post
				action.payload.date = new Date().toISOString();
				action.payload.reactions = {
					thumbsUp: 0,
					wow: 0,
					heart: 0,
					rocket: 0,
					funny: 0,
				};
				console.log(action.payload);
				//add new post to the array
				state.posts.push(action.payload);
			});
	},
});

// when the shape of the state changes, only this function needs to be updated
export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
