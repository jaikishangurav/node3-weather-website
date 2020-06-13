const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res)=>{
    res.render('index',{
        title: 'Weather App',
        name: 'Jaikishan Gurav'
    })
})

app.get('/about', (req,res)=>{
    res.render('about',{
        title: 'About Us',
        name: 'Jaikishan Gurav'
    })
})

app.get('/help', (req,res)=>{
    res.render('help',{
        title: 'Help',
        name: 'Jaikishan Gurav'
    })
})

app.get('/help/*', (req,res)=>{
    res.render('404', {
        title: '404',
        name: 'Jaikishan Gurav',
        errorMessage : 'Help article not found'
    })
})

app.get('/weather',(req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide address.'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}={}) => {
        if(error){
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })  
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })


        })
    })   
})

app.get('*', (req,res)=>{
    res.render('404', {
        title: '404',
        name: 'Jaikishan Gurav',
        errorMessage : 'Page not found'
    })
})


app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})