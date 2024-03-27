import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (typee) => {
	const {data} = await axios.get(`/posts/${typee[0]}/${typee[1]}`);
	return data;
})
export const fetchCandles = createAsyncThunk('product/fetchCandles', async (type) => {
	const {data} = await axios.get(`/product/${type}`);
	return data;
})

export const fetchUserPosts = createAsyncThunk('posts/fetchUserPosts', async (userId) => {
	const {data} = await axios.get(`/user/${userId}`);
	return data;
})
export const fetchNamePosts = createAsyncThunk('posts/fetchNamePosts', async (bookName) => {
	const {data} = await axios.get(`/book/${bookName}`);
	return data;
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const {data} = await axios.get('/tags/');
	return data;
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
	const {data} = await axios.delete(`/posts/${id}`);
})

const initialState = {
	posts: {
		items: [],
		status: 'loading',
	},
	tags: {
		items: [],
		status: 'loading',
	},
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchPosts.pending]: (state) => {
			state.posts.status = 'loading';
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
		[fetchUserPosts.pending]: (state) => {
			state.posts.status = 'loading';
		},
		[fetchUserPosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchUserPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
		[fetchNamePosts.pending]: (state) => {
			state.posts.status = 'loading';
		},
		[fetchNamePosts.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchNamePosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
		[fetchCandles.pending]: (state) => {
			state.posts.status = 'loading';
		},
		[fetchCandles.fulfilled]: (state, action) => {
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchCandles.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'error';
		},
		[fetchTags.pending]: (state) => {
			state.tags.status = 'loading';
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload;
			state.tags.status = 'loaded';
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = [];
			state.tags.status = 'error';
		},
		[fetchRemovePost.pending]: (state, action) => {
			state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
		},
	},
})

export const postsReducer = postsSlice.reducer;