const mongoose = require ('mongoose');


mongoose.connect(process.env.mongodburl)

const couponSchema = new mongoose.Schema({
    code : String,
    claimed : Boolean,
    claimedBy : String,
    claimedAt : { type: Date, default: Date.now },
});

const usersSchema = new mongoose.Schema({
    ip : String,
    time_stamp : { type: Date, default: Date.now },
})

const Coupon = mongoose.model("coupon", couponSchema);
const Users = mongoose.model("users", usersSchema);


module.exports = {Coupon, Users}    
