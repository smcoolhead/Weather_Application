const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/", function(req,res) {

    res.render("index");
    
})

app.post("/", function(req,res) {

    const cityName = req.body.cityName;
    const apiKey = "7f88d700d710db29a436a1356105f6c6";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function(response) {
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            if(weatherData.cod[0] == "4") {
                res.render("wrongCity",{weatherData : weatherData});
            } else {
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                const minTemp = weatherData.main.temp_min;
                const maxTemp = weatherData.main.temp_max;
                const pressure = weatherData.main.pressure;
                const humidity = weatherData.main.humidity;
                const seaLevel = weatherData.main.sea_level;
                const visibility = weatherData.visibility;
                const windSpeed = weatherData.wind.speed;

                const weatherReport = {
                    cityName : cityName,
                    temp : temp,
                    description : description,
                    imageURL : imageURL,
                    minTemp : minTemp,
                    maxTemp : maxTemp,
                    pressure : pressure,
                    humidity : humidity,
                    seaLevel : seaLevel,
                    visibility : visibility,
                    windSpeed : windSpeed
                }
                res.render("report",{weatherReport : weatherReport});
            }
        }) 
    })

})

app.listen(3000,function() {
    console.log("Server is running on port 3000.");
})