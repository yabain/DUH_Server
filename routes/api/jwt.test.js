require('dotenv').config({ path: '../../.env' });
const jwt = require("jsonwebtoken");
let user = {
    "_id":"61bacf6006347b0009febdce",
    "userName":"",
    "firstName":"JOHN",
    "lastName":"BEST",
    "email":"johnfbest@gmail.com",
    "emailConfirmed":false,
    "permissions":["USER"]
}

let obj = {
    email: user.email,
    userId: user._id,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    permissions: user.permissions || [],
    emailConfirmed: user.emailConfirmed || false,
};  

console.log(obj);
console.log(process.env.JWT_KEY);
console.log('\rSigning..');
let token = jwt.sign(obj, process.env.JWT_KEY, { expiresIn: "7 days" });

console.log(`\rToken: ${ token }`);
console.log('\rDecoding..');
try {
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded);
} catch(err) {
    console.error(err);
}


