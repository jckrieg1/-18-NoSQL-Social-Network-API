const { User, Thought } = require('../models');
const db = require('../config/connection');
const userData = require('./userData.json');
const thoughtData = require('./thoughtData.json');
const { Types } = require('mongoose')


const seedDatabase = async () => {
    try {
        db.once('open', async () => {
            const hasUserData = await User.find({});
            const hasThoughts = await Thought.find({});

            
            if (hasUserData.length > 0 || hasThoughts.length > 0) {
                await User.deleteMany({});
                await Thought.deleteMany({});
            }

            await User.insertMany(userData);

          
            const friendUserData = await User.find({});
            const userDataWithFriends = [];

           
            for await (let user of friendUserData) {
                let friendsData = await User.aggregate([{ $sample: { size: 2 } }]);

                friendsData.forEach(friend => {
                    if (friend._id.toString() !== user._id.toString()) {
                        user.friends.push(Types.ObjectId(friend._id))
                    };

                });
                userDataWithFriends.push(user);
            };

            
            for await (let user of userDataWithFriends) {
                await User.updateOne({ _id: Types.ObjectId(user._id) }, {
                    $push:
                    {
                        friends: {
                            $each: user.friends
                        }
                    }
                })
            };

            console.log("Database successfully seeded");
            process.exit(0);
        })
    } catch (err) {
        throw err
    }
};

seedDatabase();