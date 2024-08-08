const mongoose = require("mongoose");

//Mongo Db connection
module.exports.mongodb = async () => {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Connection error', error));

};

                                                                                                  