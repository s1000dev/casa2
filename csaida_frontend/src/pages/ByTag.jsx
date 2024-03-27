import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper";

import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { fetchPosts } from '../redux/slices/posts';
import { fetchTags } from '../redux/slices/posts';

export const ByTag = () => {
	const navigate = useNavigate();
	const [data, setData] = React.useState();
	const [isLoading, setLoading] = React.useState(true);
	const { id } = useParams();
	const userData = useSelector(state => state.auth.data);
	console.log(window.location.pathname)

	let userId = userData?._id;
	console.log(userData._id)

	React.useEffect(() => {
		axios.get(`/product/get/${userId}`).then(res => {
			setData(res.data);
			setLoading(false);
		}).catch((err) => {
			console.warn(err);
			alert('Error while getting tag!');
		});
	}, [])

	function resetShop() {
		axios.get(`/product/delete-everything/${userId}`);
		navigate("/");
	}

	const { posts, tags } = useSelector(state => state.posts);

	return (
		<>
			<Grid>
				<Grid className='posts' item>
					{(isLoading ? [...Array(5)] : data).map((obj, index) =>
						isLoading ? (
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
									isEditable={userData?._id === obj.user}
								/>
							))}
					<a href="/" onClick={resetShop} >Продукция</a>
				</Grid>
			</Grid>
		</>
	);
};
