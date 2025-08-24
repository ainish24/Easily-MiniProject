import express from "express"
import bodyParser from "body-parser"
import session from "express-session"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import multer from "multer"
import * as jobControllers from "./src/controllers/jobController.js"
import * as jobMiddlewares from "./src/middlewares/recruiter.js"
import { isLoggedIn } from "./src/middlewares/recruiter.js"
import { validationResult } from "express-validator"
import {applyValidator,postValidator,registerValidator} from "./src/middlewares/recruiter.js"
import FileStoreFactory from 'session-file-store';

const FileStore = FileStoreFactory(session);
const app = express()
dotenv.config()

app.set("view engine","ejs")
app.use(express.static('public'))
app.set("views",'./src/views')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(session({
    store: new FileStore({ path: './sessions' }),
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge:60*60*1000 }
  }))
app.use(cookieParser())
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
  
const upload = multer({ storage: storage })

app.get("/", jobControllers.onRender)
app.post("/register",registerValidator,jobControllers.register)
app.post("/login",jobControllers.login)
app.get("/login",jobControllers.displayLogin)
app.get("/logout",jobControllers.logout)
app.get("/jobs",jobControllers.getJobs)
app.get("/viewDetails/:id",jobControllers.viewDetails)
app.get("/postJob",jobControllers.getPostJob)
app.post("/postJob",postValidator,jobControllers.postJob)
app.post("/applyJob/:id",upload.single("resume"),applyValidator,jobControllers.applyJob)
app.get("/applicants/:id",jobMiddlewares.isLoggedIn,jobControllers.viewApplicants)
app.get("/patchJob/:id",jobControllers.viewEditJob)
app.patch("/patchJob/:id",jobControllers.editJob)
app.delete("/deleteJob/:id",jobControllers.deleteJob)
app.post("/searchJob",jobControllers.searchJob)
app.use((req, res) => {
  if(req.session.user){
    return res.status(404).render('errorPage',{...req.session.user,isExist:true,errMsg:"Error 404 Not Found"})
}else{
    const user={name:"Recruiters"}
    return res.status(404).render('errorPage',{...user, isExist:false,errMsg:"Error 404 Not Found"})
}
});

app.listen(3000,()=>{
    console.log("Server is Up!")
})