import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth'

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();

	const { register, handleSubmit, setError,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
		},
		mode: 'onChange',
	});

	const onSubmit = async (values) => {
		const data = await dispatch(fetchRegister(values));

		if (!data.payload) {
			return alert('Couldn\'t register');
		}

		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		} else {
		}
	}

	if (isAuth) {
		return <Navigate to='/' />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Заполните имя' })} 
					className={styles.field} label="Введите ФИО" fullWidth />
				<TextField
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					type="email"
					{...register('email', { required: 'Заполните почту' })} 
					className={styles.field} label="Введите почту" fullWidth />
				<TextField
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					type="password"
					{...register('password', { required: 'Заполните пароль' })} 
					className={styles.field} label="Введите пароль" fullWidth />
				<Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
};
