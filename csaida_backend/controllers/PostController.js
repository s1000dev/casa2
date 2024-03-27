import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';
import nodemailer from 'nodemailer'

export const getUsersBook = async (req, res) => {

  try {
	const userId = req.params.id;
	let posts;
	let sorted = [];

	posts = await PostModel.find().populate('user').exec();
		posts.map((obj) => {
			if (userId == obj.user._id){
				sorted.push(obj);
			}
		})
		.flat()

    res.json(sorted);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while getting user\' books!',
    });
  }
};

export const getNameBook = async (req, res) => {

  try {
	const bookName = req.params.id.toLowerCase();
	let posts;
	let sorted = [];

	posts = await PostModel.find().exec();
		posts.map((obj) => {
			if(obj.title.toLowerCase().includes(bookName)){
				sorted.push(obj);
			}
		})
		.flat()

    res.json(sorted);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while getting books by name!',
    });
  }
};

export const getAnyBook = async (req, res) => {

  try {
	const postTag = req.params.tag;
	const type = req.params.type;
	let posts;
	let sorted = [];

	if(type == 'new'){
		posts = await PostModel.find().sort({createdAt: -1}).populate('user').exec();
	} else if (type == 'old'){
		posts = await PostModel.find().sort({createdAt: 1}).populate('user').exec();
	} else if (type == 'popular'){
		posts = await PostModel.find().sort({viewsCount: -1}).populate('user').exec();
	}

	if(postTag != 0){
		posts.map((obj) => {
			for (let tag of obj.tags){
				if (tag == postTag){
					sorted.push(obj);
				}
			}
		})
		.flat()
	} else if(postTag == 0) {
		posts.map((obj) => sorted.push(obj))
		.flat()
	}

    res.json(sorted);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while getting books!',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()

    res.json(tags.filter((el, id) => tags.indexOf(el) === id).sort());
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while getting tags!',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error while getting book',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Book isn\'t found',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while getting book',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Error while deleting a book',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Book isn\'t found',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while deleting a book',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while creating a book',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while updating a book',
    });
  }
};

export const rent = async (req, res) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "s1000dev@gmail.com",
			pass: "lnft xkws thuj ilzg",
		}
	})

  try {
    const postId = req.params.id;
	const user = req.params.user;

	const isPostRented = await PostModel.find({_id: postId, userRenting: '000000000000000000000000'}).exec() || false;

	const userRenting = await UserModel.findOne({_id: user});
	const realPost = await PostModel.findOne({_id: postId});
	const ownerId = realPost.user;
	const owner = await UserModel.findOne({_id: ownerId});
	
	const userRentingName = userRenting.fullName;
	const userRentingEmail = userRenting.email;
	const ownerName = owner.fullName;
	const ownerEmail = owner.email;
	let mailOptions;

	if(isPostRented.length != 0) {
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				userRenting: user,
			},
		);

		mailOptions = {
			from: "s1000dev@gmail.com",
			to: `${ownerEmail}`,
			subject: `Your book has just been rented!`,
			text: `Hi ${ownerName}! ${userRentingName} just rented one of your books (${realPost.title})! Please, contact them via their email: ${userRentingEmail}`
		}
	
		res.json({
			success: 'successfully rented book',
		});
		
	} else {
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				userRenting: '000000000000000000000000',
			},
		);

		mailOptions = {
			from: "s1000dev@gmail.com",
			to: `${ownerEmail}`,
			subject: `Your book just got unrented!`,
			text: `Hi ${ownerName}! It looks like ${userRentingName} just finished reading your book (${realPost.title})! Please, contact them via their email: ${userRentingEmail}`
		}
	
		res.json({
			success: 'successful reset of a book',
		});
	}

	transporter.sendMail(mailOptions, function(error, info){
		if (error){
			console.log(error);
		}
	})

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error while updating a book',
    });
  }
};

export const addProduct = async (req, res) => {
	const postId = req.params.id;
	const userId = req.params.user;
	let isAdded;
	 
	try {
		const user = await UserModel.findOne({_id: userId});
		const smth = user.products;
		for(let i = 0; i < smth.length; i++){
			if (smth[i] == postId){
				isAdded = true;
			}
		}
		if(!isAdded){
			const arr = [postId];
			const finalArr = smth.concat(arr);
			await UserModel.updateOne(
				{_id: userId},
				{products: finalArr}
				);
			const user2 = await UserModel.findOne({_id: userId});
			res.json({
				user2
			})
		} else {
			const user2 = await UserModel.findOne({_id: userId});
			res.json({
				message: 'already added',
				user2
			})
		}
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		message: 'Error while creating a book',
	  });
	}
  };

export const deleteProduct = async (req, res) => {
	const postId = req.params.id;
	const userId = req.params.user;
	let isAdded = false;
	let index;

	try {
		const user = await UserModel.findOne({_id: userId});
		const smth = user.products;
		for(let i = 0; i < smth.length; i++){
			if (smth[i] == postId){
				isAdded = true;
				index = i;
			}
		}
		if(isAdded){
			smth.splice(isAdded - 1, 1);
			const finalArr = smth;
			await UserModel.updateOne(
				{_id: userId},
				{products: finalArr}
				);
			const user2 = await UserModel.findOne({_id: userId});
			res.json({
				user2
			})
		} else {
			const user2 = await UserModel.findOne({_id: userId});
			res.json({
				message: 'havent found',
				user2
			})
		}
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		message: 'Error while creating a book',
	  });
	}
  };

export const getMyProducts = async (req, res) => {

	try {
		const userId = req.params.user;
		const user = await UserModel.findOne({_id: userId});
		const smth = user.products;
		let sorted = [];

		let posts = await PostModel.find().populate('user').exec();
		for(let post of posts){
			for(let product of smth){
				if (product == post._id){
					sorted.push(post);
				}
			}
		}
		res.json(sorted)

	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		message: 'Error while creating a book',
	  });
	}
  };

export const sortByTag = async (req, res) => {

	try {
	  const type = req.params.type;
	  let posts;
	  posts = await PostModel.find().populate('user').exec();
	  let sorted = [];

		for(let post of posts){
			let tags = post.tags;
			if(tags[0] == type){
				sorted.push(post);
			}
		}
  
	  res.json(sorted);
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		message: 'Error while getting books!',
	  });
	}
  };

  export const deleteAllProducts = async (req, res) => {
	  try {
		const userId = req.params.user;

		await UserModel.updateOne(
			{_id: userId},
			{products: []}
		);

		res.json({
			message: 'success',
		})
	} catch (err) {
	  console.log(err);
	  res.status(500).json({
		message: 'Error while creating a book',
	  });
	}
  };