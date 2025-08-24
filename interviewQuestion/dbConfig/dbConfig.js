import mongoose from 'mongoose'

export const connectDb=async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/jobPortal')
        console.log('Db connected!')
    } catch (error) {
        console.log.og("Error connecting db", error)
    }
}
