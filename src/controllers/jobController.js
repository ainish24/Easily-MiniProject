import * as recruiterModel from "../models/recruiterModel.js"
import * as jobModel from "../models/jobModel.js"
import {mailerFunction} from "../middlewares/recruiter.js"
import { validationResult } from "express-validator"


const onRender=(req,res)=>{
    if(req.session.user){
        res.render('landingPage',{...req.session.user,isExist:true,isVisible:false,errMsg:false})
    }else{
        const user={name:"Recruiters"}
        res.render('landingPage',{...user, isExist:false,isVisible:false,errMsg:false})
    }
}

const register=(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        if(req.session.user){
            return res.render('landingPage',{...req.session.user,isExist:true,isVisible:true,errMsg:errors.array()[0].msg})
        }else{
            const user={name:"Recruiters"}
            return res.render('landingPage',{...user, isExist:false,isVisible:true,errMsg:errors.array()[0].msg})
        }
    }
    recruiterModel.addRecruiter(req.body)
    res.redirect("/login")
}

const login=(req,res)=>{
    const isExist=recruiterModel.login(req.body);
    const newDate = new Date()
    const loginDate=newDate.toLocaleString()
    if(!req.cookies.loginDate){
        res.cookie("loginDate",loginDate,{maxAge:3*24*60*60*1000})
        var lastLoggedIn=loginDate
    }else{
        var lastLoggedIn=req.cookies.loginDate
        res.cookie("loginDate",loginDate,{maxAge:3*24*60*60*1000})
    }
    if(isExist){
        req.session.user={...isExist,loginDate:lastLoggedIn}
        res.redirect("/jobs")
    }else{
        res.send("login failed")
    }
}
const displayLogin=(req,res)=>{
    if(req.session.user){
        res.render('login',{...req.session.user,isExist:true})
    }else{
        const user={name:"Recruiters"}
        res.render('login',{...user, isExist:false})
    }
}
const logout =(req,res)=>{
    req.session.destroy()
    res.redirect("/login")
}
const getJobs=(req,res)=>{
    const jobs=jobModel.getJobs()
    if(req.session.user){
        res.render('jobsPage',{...req.session.user,isExist:true,jobs})
    }else{
        const user={name:"Recruiters"}
        res.render('jobsPage',{...user, isExist:false,jobs})
    }
}
const viewDetails=(req,res)=>{
    const jobId=req.params.id
    const job=jobModel.findJob(jobId)
    const isLoggedIn = req.session.user ? true : false
    if(req.session.user){
        res.render('jobDetails',{...req.session.user,isExist:true,isLoggedIn,job,errMsg:false})
    }else{
        const user={name:"Recruiters"}
        res.render('jobDetails',{...user, isExist:false,isLoggedIn,job,errMsg:false})
    }
}
const getPostJob=(req,res)=>{
    if(req.session.user){
        res.render('postJob',{...req.session.user,isExist:true,errMsg:false})
    }else{
        const user={name:"Recruiters"}
        const errMsg="only recruiter is allowed to access this page, login as recruiter to continue"
        res.render('errorPage',{...user, isExist:false,errMsg})
    }
}
const postJob=(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        if(req.session.user){
            return res.render('postJob',{...req.session.user,isExist:true,errMsg:errors.array()[0].msg})
        }else{
            const user={name:"Recruiters"}
            const errMsg="only recruiter is allowed to access this page, login as recruiter to continue"
            return res.render('errorPage',{...user, isExist:false,errMsg})
        }
    }
    const input=req.body
    const now=new Date()
    const postedOn=now.toLocaleString("en-us",{hour12:true})
    const newJobDetails={...input,applicants:[],postedOn,recruiterId:req.session.user.id}
    jobModel.addNewJob(newJobDetails)
    res.redirect("/jobs")
}
const applyJob = (req, res) => {
    const errors = validationResult(req);
    if (!req.file) {
        errors.errors.push({
            msg: "Resume file is required",
            param: "resume",
            location: "body"
        });
    }
    if (!errors.isEmpty()) {
        const jobId = req.params.id;
        const job = jobModel.findJob(jobId);
        const isLoggedIn = req.session.user ? true : false;
        if (req.session.user) {
            return res.render('jobDetails', {
                ...req.session.user,
                isExist: true,
                isLoggedIn,
                job,
                showForm: true,
                errMsg: errors.array()[0].msg,
                formData: req.body
            });
        } else {
            const user = { name: "Recruiters" };
            return res.render('jobDetails', {
                ...user,
                isExist: false,
                isLoggedIn,
                job,
                showForm: true,
                errMsg: errors.array()[0].msg,
                formData: req.body
            });
        }
    }
    const inputDetails = { ...req.body };
    const resumeLink = `/uploads/${encodeURIComponent(req.file.filename)}`;
    jobModel.addApplicant(req.params.id, { ...inputDetails, resumeLink });
    const recEmail = req.body.email;
    const data = {
        imgURL: "https://i.pinimg.com/originals/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.gif",
        name: req.body.name
    };
    mailerFunction(recEmail, data);
    
    res.redirect("/jobs");
};

const viewApplicants=(req,res)=>{
    const applicants=jobModel.getApplicants(req.params.id)
    if(req.session.user){
        res.render('applicants',{...req.session.user,isExist:true,applicants})
    }else{
        const user={name:"Recruiters"}
        res.render('applicants',{...user, isExist:false,applicants})
    }
}
const viewEditJob=(req,res)=>{
    const jobId=req.params.id
    const job=jobModel.findJob(jobId)
    if(req.session.user.id!= job.recruiterId){
        const errMsg="You cannot edit this job as you have not posted it"
        return res.render('errorPage',{...req.session.user, isExist:true,errMsg})
    }
    if(req.session.user){
        res.render('updateJob',{...req.session.user,isExist:true,job,errMsg:false})
    }else{
        const user={name:"Recruiters"}
        res.render('updateJob',{...user, isExist:false,job,errMsg:false})
    }
}
const editJob=(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const jobId=req.params.id
        const job=jobModel.findJob(jobId)
        if(req.session.user){
            res.render('updateJob',{...req.session.user,isExist:true,job,errMsg:errors.array()[0].msg})
        }else{
            const user={name:"Recruiters"}
            res.render('updateJob',{...user, isExist:false,job,errMsg:errors.array()[0].msg})
        }
    }
    const jobId=req.params.id
    const updatedJob=req.body
    jobModel.updateJob(jobId,updatedJob)
    const jobs=jobModel.getJobs()
    if(req.session.user){
        res.render('jobsPage',{...req.session.user,isExist:true,jobs})
    }else{
        const user={name:"Recruiters"}
        res.render('jobsPage',{...user, isExist:false,jobs})
    }
}
const deleteJob=(req,res)=>{
    const jid=req.params.id
    const job=jobModel.findJob(jid)
    if(req.session.user.id!= job.recruiterId){
        const errMsg="You cannot edit this job as you have not posted it"
        return res.status(403).render('errorPage',{...req.session.user, isExist:true,errMsg})
    }
    jobModel.deleteJob(jid)
    const jobs=jobModel.getJobs()
    if(req.session.user){
        res.render('jobsPage',{...req.session.user,isExist:true,jobs})
    }else{
        const user={name:"Recruiters"}
        res.render('jobsPage',{...user, isExist:false,jobs})
    }
}
const searchJob=(req,res)=>{
    const searchInput=req.body.search
    const searchResults=jobModel.searchJob(searchInput)
    if(req.session.user){
        res.render('jobsPage',{...req.session.user,isExist:true,jobs:searchResults})
    }else{
        const user={name:"Recruiters"}
        res.render('jobsPage',{...user, isExist:false,jobs:searchResults})
    }
}



export {    
    onRender,
    register,
    login,
    displayLogin,
    logout,
    getJobs,
    viewDetails,
    getPostJob,
    postJob,
    applyJob,
    viewApplicants,
    viewEditJob,
    editJob,
    deleteJob,
    searchJob,
}