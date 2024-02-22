const bcrypt = require("bcryptjs");

const encryptPassword = (password) => {
    const hash = bcrypt.hashSync(password, parseInt(process.env.ROUNDS));
    return hash
}

const comparePassword = (password, hash) => {
    const isValid = bcrypt.compareSync(password, hash);
    return isValid;
}


module.exports = {
    encryptPassword,
    comparePassword
}