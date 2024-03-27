import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { YMaps, Map, Placemark } from 'react-yandex-maps';

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
import styles from './Contact.scss';

export const Contacts = () => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);
	const { posts, tags } = useSelector(state => state.posts);

	return (
		<>
			<Grid>
            <div class="body__map">
                <div class="contacts">
                    <p>Контакты</p>
                    <p><a href="mailto:vadit2000@mail.ru">vadit2000@mail.ru</a></p>
                    <p><a class="h5" href="tel:89164506783">8 (916) 450-67-83</a></p>
                    <p>РФ, Московская обл,</p>
                    <p>г Орехово-Зуево, ул. Ленина, д 55</p>
                </div>
                <div class="map"> 
                <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ae894ed8743bcfb0373f658d13748d8de568c0a8ee5eed18d3ace64fcc9877935&amp;source=constructor" width="100%" height="720" frameborder="0"></iframe>
                </div>
            </div>
			</Grid>
		</>
	);
};
