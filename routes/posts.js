const express = require("express")
const { ensureAuth } = require("../middleware/auth")
const router = express.Router()
const Post = require ('../models/Post')




//showo add post page
router.get('/add',  ensureAuth, (req, res) => {
    res.render('posts/add') //layout is an object
})

//process adding post
router.post('/',  ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Post.create(req.body)
        res.redirect('/dashboard')

        
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
    
})

// show all posts
router.get('/',  ensureAuth, async (req, res) => {

    try {
        const posts = await Post.find({status: 'public'}).populate('user').sort({createdAt: 'desc'})
        .lean()//in order to pass in data to a template to loop throught it
        res.render('posts/index', {
            
            posts,
        })
        
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

//Show one Post

router.get('/:id',  ensureAuth, async (req, res) => {
    try {
        let post = await Post.findOne({_id: req.params.id}).populate('user').lean()
    if (!post){
        return res.render('error/404')
    }
    if (post.user != req.user.id && post.status == 'private'){

        res.redirect('error/404')
    }

    else{
        res.render('posts/show', {post,})
    }
        
    } catch (error) {
        console.error(error)
        return res.render('error/404')
        
    }
    
    
})

//update posts

router.put('/:id',  ensureAuth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id).lean()
    if (!post){
        return res.render('error/404')
    }
    if (post.user != req.user.id){

        res.redirect('/posts')
    }

    else{
       post = await Post.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
       res.redirect('/dashboard')
    }
   
        
    } catch (error) {
        
        console.error(error)
        return res.render('error/500')
    }
})

//show edit page
router.get('/edit/:id',  ensureAuth, async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id}).lean()
    if (!post){
        return res.render('error/404')
    }
    if (post.user != req.user.id){

        res.redirect('/posts')
    }

    else{
        res.render('posts/edit', {post,})
    }
        
    } catch (error) {
        console.error(error)
        return res.render('error/500')
        
    }
    
    
})

//update posts

router.put('/:id',  ensureAuth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id).lean()
    if (!post){
        return res.render('error/404')
    }
    if (post.user != req.user.id){

        res.redirect('/posts')
    }

    else{
       post = await Post.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
       res.redirect('/dashboard')
    }
   
        
    } catch (error) {
        
        console.error(error)
        return res.render('error/500')
    }
    
})

//Delete post

router.delete('/:id',  ensureAuth, async (req, res) => {
    try {
        
            let post = await Post.findById(req.params.id).lean()
        if (!post){
            return res.render('error/404')
        }
        if (post.user != req.user.id){
    
            res.redirect('/posts')
        }
    
        else{
           post = await Post.remove({_id: req.params.id})
           res.redirect('/dashboard')
        }
       
    } catch (error) {
        console.error(error)
        return res.render('error/500')
        
    }
})

//user posts
router.get('/user/:userId',  ensureAuth, async (req, res) => {
    try {
        const posts = await Post.find({user: req.params.userId, status: 'public'}).populate('user').lean()
        res.render('posts/index', {posts,})
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})




module.exports = router