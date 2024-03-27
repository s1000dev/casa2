
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';

import axios from '../../axios'

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovePost } from '../../redux/slices/posts';

import { fetchPosts } from '../../redux/slices/posts';
import { FullPost } from '../../pages/FullPost';
import { selectIsAuth } from '../../redux/slices/auth';

export const Post = ({
	id,
	title,
	createdAt,
	imageUrl,
	user,
	viewsCount,
	tags,
	children,
	isFullPost,
	isLoading,
	isEditable,
	userRenting,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userData = useSelector(state => state.auth.data);

	if (isLoading) {
		return <PostSkeleton />;
	}

	let path = window.location.pathname;


	const onClickRemove = () => {
		if (window.confirm('Do you wanna delete?')) {
			dispatch(fetchRemovePost(id));
		}
	};

	function doDispatch(e) {
		let tag = e.currentTarget.innerText.slice(1);
		toTag(e.currentTarget);
		if (isFullPost) {
			dispatch(fetchPosts(['new', tag]));
			navigate('/');
		}
		dispatch(fetchPosts(['new', tag]));
	}

	function toTag(link) {
		let tags = document.querySelectorAll('.tags a');
		let tag;
		for (let tag of tags) {
			tag.style.outline = 'none';
		}
		if (isFullPost) {
			setTimeout(function () {
				let spans = document.querySelectorAll('.tags a .MuiTypography-root');
				for (let span of spans) {
					if (span.innerText == link.innerText.slice(1)) {
						console.log('no')
						tag = span.closest('a');
						console.log(tag)
						tag.style.outline = '2px solid #4361ee';
					}
				}
			}, 200)
		}
		else {
			let spans = document.querySelectorAll('.tags a .MuiTypography-root');
			for (let span of spans) {
				if (span.innerText == link.innerText.slice(1)) {
					tag = span.closest('a');
					tag.style.outline = '2px solid #4361ee';
				}
			}
		}
	}

	function createRentBtn() {
		if (userData) {
			if (path == '/tag') {
				return <a className={styles.rent} onClick={rentBook}>
					Удалить из корзины
				</a>
			} else {
				return <a className={styles.rent} onClick={rentBook}>
					Добавить в корзину
				</a>
			}
		} else {
			return <a className={styles.rent} onClick={alertUser}>
				Добавить в корзину
			</a>
		}
	}

	function alertUser() {
		alert('You need to log in first!')
	}

	async function rentBook() {
		let userId = userData?._id;
		if (userId && path != '/tag') {
			const { response } = await axios.get(`/product/add/${id}/${userId}`);
			console.log(response);
			alert('Success!')
		} else if (userId && path == '/tag') {
			const { response } = await axios.get(`/product/delete/${id}/${userId}`);
			console.log(response);
			alert('Success delete!')
		} else {
			alert('You need to log in first!')
		}
	}

	return (
		<div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
			{isEditable && (
				<div className={styles.editButtons}>
					<Link to={`/posts/${id}/edit`}>
						<IconButton color="primary">
							<EditIcon />
						</IconButton>
					</Link>
					<IconButton onClick={onClickRemove} color="secondary">
						<DeleteIcon />
					</IconButton>
				</div>
			)}
			{imageUrl && (
				<img
					className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
					src={imageUrl}
					alt={title}
				/>
			)}

			{!imageUrl && (
				<img
					className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
					src={"http://localhost:4444/uploads/question.png"}
					alt={title}
				/>
			)}
			<div className={styles.wrapper}>
				<div className={styles.rentWrap}>
					{(createRentBtn())}
				</div>

				<div className={styles.indention}>
					<h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
						{isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
					</h2>
					{children && <div className={styles.content}>{children}</div>}
					<ul className={styles.postDetails}>

					</ul>
				</div>
			</div>
		</div >
	);
};
