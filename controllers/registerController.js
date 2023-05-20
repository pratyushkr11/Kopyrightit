const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, mail, pwd } = req.body;
    if (!name || !mail || !pwd) return res.status(400).json({ 'message': 'Name, email and password are required.' });
    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email: mail }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //create & store the new user
        const result = await User.create({
            "name": name,
            "email": mail,
            "password": hashedPwd
        });
        // console.log(result);

        res.status(201).json({ 'success': `New user ${name} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };