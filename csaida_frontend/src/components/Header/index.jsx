import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import companyLogo from './logo.svg'
import companyShop from './shop.svg'

import { fetchPosts } from '../../redux/slices/posts'

export const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	const userData = useSelector(state => state.auth.data);

	let isAdmin = false;
	if (userData?._id == '660039e68ba66dc58319e952') {
		isAdmin = true
	}

	const onClickLogout = () => {
		if (window.confirm('Do you wanna quit?')) {
			dispatch(logout());
			window.localStorage.removeItem('token');
		}
	};

	const [value, setValue] = React.useState(0);

	function doThis() {
		let tags = document.querySelectorAll('.tags a');
		for (let tag of tags) {
			tag.style.outline = 'none';
		}
		navigate("/");
		setValue(0);
		dispatch(fetchPosts(['new', '0']));
	}

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<a className={styles.logo} onClick={doThis}>
						<img src={companyLogo} alt="logo" />
					</a>

					<div class="li_left" id="top_menu">
						<ul>
							<li ><a href="/" >Продукция</a></li>
							<li ><Link to="/contacts" >Контакты</Link></li>
						</ul>
					</div>

					<div className={styles.buttons}>
						{isAdmin ? (
							<>
								<Link to="/add-post">
									<Button variant="contained">Загрузить товар</Button>
								</Link>
								<Button onClick={onClickLogout} variant="contained" color="error">
									Выйти
								</Button>
							</>
						) : (
							isAuth ? (
								<>
									<Link className={styles.shopimg} to="/tag">
										<img src={companyShop} alt="shop" />
									</Link>
									<Button onClick={onClickLogout} variant="contained" color="error">
										Выйти
									</Button>
								</>
							) : (
								<>
									<Link to="/register">
										<Button variant="contained">Регистрация</Button>
									</Link>
									<Link to="/login">
										<Button variant="outlined">Войти</Button>
									</Link>
								</>
							)
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};
