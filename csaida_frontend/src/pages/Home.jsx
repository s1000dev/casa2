import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";

import { Post } from '../components/Post';
import { fetchNamePosts, fetchPosts, fetchCandles } from '../redux/slices/posts';
import { fetchUserPosts } from '../redux/slices/posts';
import { fetchTags } from '../redux/slices/posts';
import { SideBlock } from "../components/SideBlock";

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);
	const { posts, tags } = useSelector(state => state.posts);

	const isPostsLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';

	React.useEffect(() => {
		dispatch(fetchPosts(['new', '0']));
		dispatch(fetchTags());
	}, []);

	function sortByTag(e) {
		setValue(0);
		let tag = e.currentTarget.querySelector('span').innerText;
		changeTagStyles(e.currentTarget.closest('a'))
		dispatch(fetchPosts(['new', tag]));
	}

	function changeTagStyles(link) {
		let tags = document.querySelectorAll('.tags a');
		for (let tag of tags) {
			tag.style.outline = 'none';
		}
		if (link) {
			link.style.outline = '2px solid #4361ee';
		}
	}

	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
		changeTagStyles();

		if (newValue == 2) {
			dispatch(fetchCandles('sticks'));
		} else if (newValue == 1) {
			dispatch(fetchCandles('candles'));
		} else if (newValue == 0) {
			dispatch(fetchPosts(['new', '0']));
		}
	};

	function resetToNew() {
		changeTagStyles();
		dispatch(fetchPosts(['new', '0']));
	}

	function sortByBookName() {
		let value = getSearchInput();
		setValue(0);
		changeTagStyles();
		if (value) {
			dispatch(fetchNamePosts(value));
		} else {
			dispatch(fetchPosts(['new', '0']));
		}
	}

	function getSearchInput() {
		let input = document.querySelector('.search input');
		return input.value;
	}

	return (
		<>
			<Grid>
				<Grid container rowSpacing={1}>
					<Grid item>
						<Tabs value={value} onChange={handleChange} style={{ marginBottom: 15 }}>
							<Tab label="Все товары" />
							<Tab label="Свечи" />
							<Tab label='Подсвечники'></Tab>
						</Tabs>
					</Grid>
				</Grid>
			</Grid >
			<Grid>
				<Grid className='posts' item>
					{(isPostsLoading ? [...Array(6)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
							<Post key={index} isLoading={true} />
						)
							: (
								<Post
									id={obj._id}
									title={obj.title}
									imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
									user={obj.user}
									createdAt={obj.createdAt.slice(0, 10)}
									viewsCount={obj.viewsCount}
									tags={obj.tags}
									isEditable={userData?._id === obj.user._id}
									userRenting={obj.userRenting}
								/>
							))}
				</Grid>
			</Grid>
		</>
	);
};
