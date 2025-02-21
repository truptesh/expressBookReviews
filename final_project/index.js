const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if (req.session.authorization){
    const token  = req.session.authorization['accessToken']
    console.log(token)
    jwt.verify(token, "JWTsecret", (err, user) => {
        if (!err){
            req.user = user.data
            next()
        } else {
            return res.status(403).json({message: "something went wrong this token"})
        }
    })
} else {
    return res.status(401).json({message: "unauthorized access"})
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));
