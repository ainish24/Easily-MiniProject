const recruiters=[
    {
        id:1,
        name:"ainish",
        email:"ainish@gmail.com",
        password:123
    }
]

let recruiterId = 2;

const addRecruiter=(recruiter)=>{
    const newRecruiter={id:recruiterId++,...recruiter}
    recruiters.push(newRecruiter)
}

const login=(loginDetails)=>{
    let isExist=recruiters.find(r=>r.email==loginDetails.email && r.password==loginDetails.password)
    return isExist
}

export{
    addRecruiter,
    login
}