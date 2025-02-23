// .env config
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

// Importing Database connection module
const meets = require("./Models/meets");
const setCookies = require("./Controllers/setCookies");
const checkCookie = require("./Middleware/checkCookies");
const { getCookies } = require("./Controllers/getCookies");


// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: "GET, POST, PUT, DELETE", // Allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));


// Api 1
app.post("/saveMeet", async (req, res) => {
  if (req.body.Name) {
    try {
      const meet = await meets.create(req.body);
      if (meet) {
          const token = setCookies(meet); // Generate token
          res.cookie("token", token, {
          httpOnly: true,
          sameSite: "none",
          secure:true,
        });
     console.log("SuccessFully Saved Data in Data Base");
        return res
          .status(201)
          .json({
            success :true,
            data : meet._id
          });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "fail", message: "not created" });
    }
  } else {
    return res
      .status(404)
      .json({ status: "fail", message: "No username or meetingId" });
  }
});



app.post("/local",(req,res)=>{
try {
  console.log("I got the local");
console.log(req.body);
  if(req.body){ 
    res.status(200).json({status:'success',message:"req.body is true"})
  }else{res.status(404).json({status:'fail',message:'no req.boyd'})}
} catch (error) {
  console.log(error);
  res.status(500).json({status:'fail',message:error});
}

});

app.get('/test',(req,res)=>{
  res.send("Server is live");
});




app.post("/seeMeet", async (req, res) => {
  try {
const meet = await meets.findById({ _id: req.body.meetingId });
if(meet){
  return res.status(200).json({
    success:true,
    data : meet.Name
  })
}else{
  res.status(200).json({
    success: false,
    data : null
  })
}
  } catch (error) {
    console.log("In catch and error is::",error);
   return res.status(500).json({status:'fail',message:"500"});
  }
});

module.exports = { app };