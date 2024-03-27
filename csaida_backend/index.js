import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

mongoose
	.connect("mongodb+srv://vadit2005ur:311533V@cluster0.nzxv7rm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err));

	const storage = multer.diskStorage({
	  destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
		  fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	  },
	  filename: (_, file, cb) => {
		cb(null, file.originalname);
	  },
	});
	
	const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/product/add/:id/:user', PostController.addProduct);
app.get('/product/delete/:id/:user', PostController.deleteProduct);
app.get('/product/get/:user', PostController.getMyProducts);
app.get('/product/:type/', PostController.sortByTag);
app.get('/product/delete-everything/:user', PostController.deleteAllProducts);

app.get('/tags', PostController.getLastTags);
app.get('/posts/:type/:tag', PostController.getAnyBook);
app.get('/user/:id', PostController.getUsersBook);
app.get('/book/:id', PostController.getNameBook);
app.get('/rent/:id/:user', PostController.rent);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
