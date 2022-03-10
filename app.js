const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {
    loadContact,
    findContact,
    addContact,
    deleteContact,
    updateContact
} = require('./Controller/contact')
const {
    body,
    validationResult,
    check
} = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const {
    cookie
} = require('express/lib/response')

const app = express()
const port = 3000

//gunakan ejs
app.set('view engine', 'ejs')

//third party Middleware
app.use(expressLayouts)

//Middleware
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
}))

//Konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
    cookie: {
        maxAge: 6000
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//route
app.get('/', (req, res) => {

    const mahasiswa = [{
        test: 'test'
    }];
    const data = [{
            nama: 'Yudha',
            kelas: 'TIF RP 18A'
        },
        {
            nama: 'Asep',
            kelas: 'TIF RP 18B'
        },
        {
            nama: 'Cecep',
            kelas: 'TIF RP 18C'
        },
    ]
    res.render('index', {
        title: "Halaman Index",
        data,
        mahasiswa,
        layout: 'layouts/main-layout',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'Halaman About'
    })
})

app.get('/contact', (req, res) => {
    const contacts = loadContact();
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Kontak',
        contacts,
        msg: req.flash('msg')
    })
})

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Form tambah data'
    })
})

app.post('/contact', [
    check('nohp', 'Nomor HP harus di isi').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            title: 'Form Tambah data',
            layout: 'layouts/main-layout',
            errors: errors.array()
        })
    } else {
        addContact(req.body)
        //flash message
        req.flash('msg', 'Data Kontak Berhasil diTambahkan')
        res.redirect('/contact')
    }
})

app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Detail Kontak',
        contact
    })
})

app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama)

    if (!contact) {
        res.status(404)
        res.send('Data tidak ada')
    } else {
        deleteContact(req.params.nama)

        req.flash('msg', 'Data Kontak Berhasil Dihapus')
        res.redirect('/contact')
    }
})

app.post('/contact/update', [
    check('nohp', 'Nomor HP harus di isi').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            title: 'Form Ubah data',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body
        })
    } else {
        updateContact(req.body)
        // //flash message
        req.flash('msg', 'Data Kontak Berhasil diUbah')
        res.redirect('/contact')
    }
})

app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama)
    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'Form edit data',
        contact
    })
})



app.use('/', (req, res) => {
    res.status(404)
    res.send('404 Page Not Found')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})