const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:              {type: String}, 
    auto:              {type: String},
    email:             {type: String}, 
    password:          {type: String}, 
    password_confirm:  {type: String},
});
const Users = mongoose.model('Users', userSchema);

module.exports = Users;
