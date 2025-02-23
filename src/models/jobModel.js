let jobs=[
    {
        id:1,
        companyName:"Coding Ninjas",
        jobCategory:"Tech",
        jobRole:"SDE",
        jobLocation:"Gurgaon",
        salary:"14-20 lpa",
        totalOpenings:"5",
        skills:["React","NodeJs","JS","SQL","MongoDB","Express","AWS"],
        postedOn: "2/17/2025, 1:08:39 PM",
        applyBy:"30 Aug 2025",
        recruiterId:1,
        applicants:[
            {
                id:1,
                name:"ainish",
                email:"ainish@gmail.com",
                contact:"7978659400",
                resumeLink:"/uploads/Ainish%20Vadhwani%20Edited.pdf"
            }
        ]
    },
    {
        id:2,
        companyName:"EY",
        jobCategory:"Non-Tech",
        jobRole:"HR",
        jobLocation:"Pune",
        salary:"8-10 lpa",
        totalOpenings:"3",
        skills:["SpringBoot","JAVA","SQL"],
        postedOn: "2/04/2025, 6:15:47 PM",
        applyBy:"23 March 2025",
        recruiterId:1,
        applicants:[]
    },
    {
        id:3,
        companyName:"PWC",
        jobCategory:"Tech",
        jobRole:"MERN Developer",
        jobLocation:"Bangalore",
        salary:"12-14 lpa",
        totalOpenings:"1",
        skills:["React","NodeJs","JS","MongoDB","Express","Data Structures & Algo"],
        postedOn: "1/25/2025, 2:27:10 PM",
        applyBy:"17 March 2025",
        recruiterId:2,
        applicants:[]
    }
]

let jobId=4

const getJobs=()=>{
    return jobs
}
const findJob=(id)=>{
    return jobs.find(job=>job.id==id)
}
const addNewJob=(newJob)=>{
    const pushJob={id:jobId++,...newJob}
    const inputDate=pushJob.applyBy
    const dateObj=new Date(inputDate)
    const formattedDate=new Intl.DateTimeFormat("en-GB",{
        day:"2-digit",
        month:"short",
        year:"numeric"
    }).format(dateObj)
    pushJob.applyBy=formattedDate
    jobs.push(pushJob)
}
const addApplicant=(jobid,newApplicant)=>{
    jobs.forEach((job)=>{
        if(job.id==jobid){
            const applicantid=job.applicants.length+1
            const addApplicant={id:applicantid,...newApplicant}
            job.applicants.push(addApplicant)
        }
    })
}
const getApplicants=(jid)=>{
    return jobs.find(job=>job.id==jid).applicants
}
const updateJob=(jid,updatedJob)=>{
const jobIndex=jobs.findIndex(job=>job.id==jid)
const newJob={...jobs[jobIndex],...updatedJob}
jobs[jobIndex]=newJob
}
const deleteJob=(jid)=>{
    jobs=jobs.filter(job=>job.id!=jid)
}
const searchJob=(searchInput)=>{
    return jobs.filter((job)=>{
        return Object.values(job).some(value=>String(value).includes(searchInput))
    })
}

export{
    getJobs,
    findJob,
    addNewJob,
    addApplicant,
    getApplicants,
    updateJob,
    deleteJob,
    searchJob
}