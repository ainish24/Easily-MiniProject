import nodemailer from "nodemailer"
import path from "path"
import ejs from "ejs"
import dotenv from "dotenv"
dotenv.config()
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { body } from "express-validator"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const isLoggedIn=(req,res,next)=>{
    if(!req.session.user){
        const user={name:"Recruiters"}
        const errMsg="only recruiter is allowed to access this page, login as recruiter to continue"
        return res.render('errorPage',{...user, isExist:false,errMsg})
    }
    next()
}

const tranporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.Nodemailer_Email,
        pass:process.env.Nodemailer_Password
    }
})
const templatePath=path.join(__dirname,"..","views","mail.ejs")
const mailerFunction=(recEmail,data)=>{
    ejs.renderFile(templatePath,data,(error,personalizedHtml)=>{
        if(error){
            console.log("Error rendering template: " , error)
            return
        }
        const mailOptions={
            from:process.env.Nodemailer_Email,
            to:recEmail,
            subject:"Job Application Received",
            html:personalizedHtml
        }
        tranporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log("Error sending email:" ,error)
            }else{
                console.log("Email sent successfully:", info.response)
            }
        })
    })
    
}

const applyValidator=[
    body('name').notEmpty().withMessage("Name cannot be empty"),
    body('email').notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Enter a valid Email"),
    body('contact').notEmpty().withMessage("Contact cannot be empty").isMobilePhone().withMessage("Enter a valid contact number"),
    body("file")
    .custom((_, { req }) => {
      if (!req.file) {
        throw new Error("No file uploaded!");
      }
      if (!req.file.originalname.toLowerCase().endsWith(".pdf")) {
        throw new Error("Only .pdf files are allowed!");
      }
      return true;
    }),
]
const postValidator=[
    body("jobCategory").custom((value,{req})=>{
        if(!value || value=="select job category"){
            throw new Error("Select Job Category")
        }
        return true
    }),
    body("jobRole").custom((value,{req})=>{
        if(!value || value=="select job designation"){
            throw new Error("Select Job role")
        }
        return true
    }),
    body("jobLocation").notEmpty().withMessage("Enter Job Location"),
    body("companyName").notEmpty().withMessage("Enter Company Name"),
    body("salary").notEmpty().withMessage("Enter salary"),
    body("totalOpenings").notEmpty().withMessage("Enter Total Openings"),
    body("skills").custom((value,{req})=>{
        if(!value || value=="select skills required for this job"){
            throw new Error("Select Required Skills")
        }
        return true
    }),
    body("applyBy").custom((value,{req})=>{
        if(!value){
            throw new Error("Select Date")
        }
        return true
    })
]

const registerValidator=[
    body("name").notEmpty().withMessage("Enter Name"),
    body("email").isEmail().withMessage("Enter Email"),
    body("password").notEmpty().withMessage("Enter Password").isLength({min:3}).withMessage("Password should be more than 3 characters")
]

export {
    mailerFunction,
    applyValidator,
    postValidator,
    registerValidator
}