import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Footer.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';


export const Footer = () => {

	return (
		<div className={styles.footer__container}>
			<div className={styles.footer__copyright}>
                <div className={styles.footer__group}>
                    <h3>Позвонить нам:</h3>
                    <div class="footer__links">
                        <a href="tel:74959999999">+7 (495) 999-99-99</a>
                    </div>
                </div>

                <div className={styles.footer__group}>
                    <h3>Решения для дома:</h3>
                    <div class="footer__links">
                        <a href="/">Свечи СaldăСasă <br /></a>
                        <a href="/">Главная идея компании</a>
                    </div>
                </div>

                <div className={styles.footer__group}>
                    <h3>Компания:</h3>
                    <div class="footer__links">
                        <a href="/contacts">Контакты<br /></a>
                        <a href="/contacts">Вакансии<br /></a>
                    </div>
                </div>
            </div>
            <div className={styles.footer__copyright}>
                <h3>СaldăСasă © 2024</h3> 
            </div>
        </div>
	);
};
