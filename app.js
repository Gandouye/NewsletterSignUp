const express = require("express")
const request = require("request")
const https = require("https")
const bodyParser = require("body-parser")
const portHoroku = process.env.PORT
const port = 3000
const mailChimpApiKey = "2c525779553873724b6235fd032026f9-us11"
const mailChimpAudianceId = "693dfe8d80"

const app = express()

app.use(express.static("public"))  //pour avoir access aux images et css localement dans le repertoir public

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post('/', function (req, res) {
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email
    let rememberMe = req.body.rememberMe

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const url = 'https://us11.api.mailchimp.com/3.0/lists/' + mailChimpAudianceId;

    const options = {
        method: "POST",
        auth: "Guy:" + mailChimpApiKey
    }

    const jsonData = JSON.stringify(data);

    const request = https.request(url, options, function (response) {

        if (res.statusCode === 200) { 
           res.sendFile(__dirname + "/success.html") 
        } else { 
            res.sendFile(__dirname + "/failure.html") 
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });


    });

    request.write(jsonData);
    request.end();

    //console.log(firstName + "  " + lastName + "  " + email + " " + rememberMe)

    //res.send(firstName + "  " + lastName + "  " + email + " " + rememberMe)
})


app.post('/failure', (req, res)=>{
    res.redirect(__dirname + "/signup.html")
})


app.listen(portHoroku || port, () => {
    console.log("App is running on port " + port)
})

