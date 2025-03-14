const express = require('express');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const {Users, Coupon} = require('./db.js');
const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(cors());
app.listen(3001, () => {
  console.log('Server running on port 3000');
});


function checkOneHourCompleted(timestamp) {
    console.log(timestamp)

    const givenTime = new Date(timestamp);
    const currentTime = new Date();
    console.log(givenTime, currentTime);
    
    const diffMs = currentTime - givenTime; // Difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000); // Convert to seconds
    const diffMinutes = Math.floor(diffSeconds / 60); // Convert to minutes
    const remainingSeconds = 3600 - diffSeconds; // Remaining seconds in an hour
    console.log(diffSeconds, diffMinutes, remainingSeconds);

    if (diffSeconds >= 3600) {
        console.log("Completed");
        return {remainingMinutes:0,remainingSec:0}
    } else {
        const remainingMinutes = Math.floor(remainingSeconds / 60);
        const remainingSec = remainingSeconds % 60;
        console.log(remainingMinutes, remainingSec);
        return {remainingMinutes,remainingSec}
    }
    }

app.get('/', async(req, res) => {
    user_ip = req.ip;
    console.log(req.ip)

    const claimed_coupoun = await Users.findOne({ ip: user_ip }).sort({ _id: -1 });

    if(claimed_coupoun){
        const {remainingMinutes,remainingSec} = checkOneHourCompleted(claimed_coupoun.time_stamp);
        if(remainingMinutes == 0 && remainingSec == 0){
            const coupon = await Coupon.findOne({ claimed: false }).sort({ _id: 1 });
                if (!coupon) {
                    return res.json({ message: "No available coupons at the moment." });
                }
                
                    coupon.claimed = true;
                    coupon.claimedBy = user_ip;
                    coupon.claimedAt = new Date(); 
                    await coupon.save();
                
                    await Users.create({ip : user_ip});
                
                    return res.json({
                    message: `You have successfully claimed ${coupon.code}`,
                    coupon: coupon.code,
                    });


            
        }else{
            return res.status(200).send({remainingMinutes,remainingSec});
        }}
        const coupon = await Coupon.findOne({ claimed: false }).sort({ _id: 1 });
                if (!coupon) {
                    return res.json({ message: "No available coupons at the moment." });
                }
                
                    coupon.claimed = true;
                    coupon.claimedBy = user_ip;
                    coupon.claimedAt = new Date(); 
                    await coupon.save();
                
                    await Users.create({ip : user_ip});

                    res.cookie("last_claim", new Date().toISOString(), { maxAge: 3600000, httpOnly: true });
                
                    return res.json({
                    message: `You have successfully claimed ${coupon.code}`,
                    coupon: coupon.code,
                    });


})



