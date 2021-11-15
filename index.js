// import
const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const burgers = require('./burgers')
const { Cookie } = require('express-session')
const e = require('express')

// --- setup -----//
const app = express()

app.use(express.json())
app.use(express.urlencoded( { extended: true } ))

app.set('view engine', 'hbs')

app.engine('hbs', handlebars({
    layoutDir: __dirname + 'views/layouts',
    extname: 'hbs'
}))

app.use(express.static(path.join(__dirname, 'public')))

// ----------- session ----------------//

app.use(cookieParser())
app.use(session({
    secret: 'data-burgers-xxll',
    proxy: true,
    resave: true,
    saveUninitialized: true
}))

// ----------- data -------------------//

let cart = []
let total = 0
// ----------- routes -----------------//

app.get('/', (req, res) => {

    res.render('index', {
        layout: 'main',
        h_burgers: burgers,
        cart: cart,
        total: total
     })
})

app.get('/buy/:id', (req, res) => {
    const id = req.params.id
    const burger = burgers.find(b => b.id == id)

    const item = { id: cart.length, name: burger.name,  price: burger.price }

    total += burger.price

    cart.push(item)

    res.redirect('/')
})

app.get('/remove/:id', (req, res) => {
    const id = req.params.id
    
    // [5, 6, 7, 1]
    const index = cart.findIndex(t => t.id == id)
    const item = cart[index]

    total -= item.price
    cart.splice(index, 1)
    
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main'
    })
})

app.post('login', (req, res) => {
    const username = req.body.username
    const phone = req.body.phone
})

// ----------- run server ----------- //
const port = process.env.PORT

app.listen(port, () => {
    console.log('> server is running on http://localhost:' + port);
})