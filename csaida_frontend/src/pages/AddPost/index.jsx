import React from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios'

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from '../../redux/slices/auth';
import styles from './AddPost.module.scss';

export const AddPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);

	const [isLoading, setLoading] = React.useState(false);
	const [text, setText] = React.useState('');
	const [title, setTitle] = React.useState('');
	const [tags, setTags] = React.useState('');
	const [imageUrl, setImageUrl] = React.useState('');
	const inputFileRef = React.useRef(null);

	const isEditing = Boolean(id);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			formData.append('image', event.target.files[0]);
			const { data } = await axios.post('/upload', formData);
			setImageUrl(data.url);
		} catch (error) {
			console.warn(error);
			alert('Error!')
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl('');
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setLoading(true);

			const fields = {
				title,
				imageUrl,
				tags,
				text
			}

			const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields);

			const _id = isEditing ? id : data._id;

			navigate(`/posts/${_id}`);
		} catch (error) {
			console.warn(error);
			alert('err');
		}
	}

	React.useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`).then(({ data }) => {
				setTitle(data.title);
				setText(data.text);
				setImageUrl(data.imageUrl);
				setTags(data.tags.join(','));
			}).catch(err => {
				console.warn(err);
			})
		}
	}, [])

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Start typing text...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[],
	);

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to='/' />
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
				Upload a file
			</Button>
			<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
			{imageUrl && (
				<>
					<Button variant="contained" color="error" onClick={onClickRemoveImage}>
						Delete
					</Button>
					<img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Name of a book..."
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField classes={{ root: styles.tags }} variant="standard" placeholder="Tags splitted by a comma"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth />
			<SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? 'Save' : 'Upload'}
				</Button>
				<a href="/">
					<Button size="large">Cancel</Button>
				</a>
			</div>
		</Paper>
	);
};
