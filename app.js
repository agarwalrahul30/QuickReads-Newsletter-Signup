//jshint esversion:6
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res) {          
    //Some action needs to take place after filling of form
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    var data = {                            
        //make the data according to Mailchimp format
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };                                      

    const jsonData = JSON.stringify(data);     //json data -> string data

    const url = "https://us20.api.mailchimp.com/3.0/lists/8f2f09b1ee";

    const options = {
        method: "POST",
        auth: "rahul:44eaae055691f13fbc2292fe14176aa7-us20"
    }

    const request = https.request(url, options, function(response) {   
        //make a request to Post data
        response.on("data", function(data) {
            console.log(JSON.parse(data));

            if(response.statusCode === 200) {
                res.sendFile(__dirname+"/success.html");   //display success page
            }
            else {
                res.sendFile(__dirname+"/failure.html");   //display failure page
            }
        })
    })

    request.write(jsonData);       //send this data to Mailchimp server
    request.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is up and running on port 3000...");
})