import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    age: Number,
    password: Number,
    type: {
        type: String,
        enum: ["student", "recruiter"]
    }
})

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    likeable: {
        type: mongoose.Types.ObjectId,
        ref: 'jobs'
    },
    on_model: String
})

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    company: String,
    salary: Number,
    applicants: [{ type: mongoose.Types.ObjectId }]
})

const applicants = new mongoose.Schema({
    jobId: {
        type: mongoose.Types.ObjectId,
        ref: 'jobs'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
})


const userModel = mongoose.model('user', userSchema)
const likeModel = mongoose.model('like', likeSchema)
const jobModel = mongoose.model('job', jobSchema)
const applicantsModel = mongoose.model('jobApplicant', applicants)

export default {
    userModel,
    likeModel,
    jobModel,
    applicantsModel
}