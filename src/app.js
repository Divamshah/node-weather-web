const path = require('path');
const express = require ('express');
const hbs = require('hbs');

 const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));


app.get('/weather', (req,res)=>{
    if(!req.query.address) {
        return res.send({
            error: 'You must enter an address!'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location } = {})=>{
         if(error) {
             return res.send({error})
         }

         forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address:req.query.address
            })
         })
    })
})

app.get('', (req,res) => {
    res.render('index', {
        title: "Weather App",
        name: "Andrew"
    });
});

app.get('/about', (req,res) => {
    res.render('about', {
        name:'Andrew',
        title:'About'
    } )
})

app.get('/help', (req,res) => {
    res.render('help', {
        title:'Help',
        name:'Andrew',
        helpText: 'This is some helpful text'
    } )
})

app.get('/help/*', (req,res)=>{
    res.render('404', {
         title:'404',
         name:'Andrew',
         errorMessage:'Help Article Not Found'
    });
})

app.get('*', (req,res)=>{
    res.render('404', {
         title:'404',
         name:'Andrew',
         errorMessage:'Page Not Found'
    });
})

app.listen(3000,()=>{
    console.log('Server is up and running');
})