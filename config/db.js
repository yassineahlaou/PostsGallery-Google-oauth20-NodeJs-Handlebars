  const mongoose =  require('mongoose')

  const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            //stop some warnings in console

            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false,
            //useFindAndModify is not supported in mongoose v +6


        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(error)
        process.exit(1)

        
    }
  }
  module.exports = connectDB