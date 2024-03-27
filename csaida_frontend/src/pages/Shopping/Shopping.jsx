import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './Shopping.scss';

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

import { Post } from '../../components/Post';
import { fetchNamePosts, fetchPosts } from '../../redux/slices/posts';
import { fetchUserPosts } from '../../redux/slices/posts';
import { fetchTags } from '../../redux/slices/posts';
import { SideBlock } from "../../components/SideBlock";

export const Shopping = () => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);
	const { posts, tags } = useSelector(state => state.posts);

	const isPostsLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';

	return (
		<>
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
			<div>
				<Link to="/register" className={styles.Button}> 
					{/* Должна просто очищаться корзина */}
					<Button variant="contained">Оформить покупку</Button>
				</Link>
			</div>
		</>
	);
};
