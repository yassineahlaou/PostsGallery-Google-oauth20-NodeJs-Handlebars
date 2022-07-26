const express = require("express")
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const router = express.Router()
const Post = require ('../models/Post')




//login & landing page
router.get('/',  ensureGuest, (req, res) => {
    res.render('login' , {layout:'login',}) //layout is an object
})

//dashboard page
router.get('/dashboard', ensureAuth,  async (req, res) => {
    try {
        const posts = await Post.find({user: req.user.id}).lean()//in order to pass in data to a template to loop throught it
        res.render('dashboard', {
            name: req.user.firstName,
            posts
        })
         
    } catch (error) {
        console.eroor(error)
        res.render('error/500')
    }
    
})

module.exports = router