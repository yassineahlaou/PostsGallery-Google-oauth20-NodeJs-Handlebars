const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true,
        trim: true
    },
    body:{
        type: String,
        required:true,
    },
    status:{
        type: String,
        
        default:'public',
        enum: ['public', 'private'] 

    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
       ref: 'User' //the way we connected to user model
    },
    
    createdAt:{
        type: Date,
        default: Date.now

    }
})

module.exports=mongoose.model('Post', PostSchema)