import schemaModels from '../dbConfig/dbSchema.js'

export const detailsController = async(req,res)=>{
    try {
        const {min, max} = req.body
        const jobs=await schemaModels.jobModel.aggregate([
            {$match:{$and:[{salary:{$gte:min}, salary:{$lte:max}}]}},
            {$lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"likeable",
                as:"likesData"
            }},
            {$addFields:{likes:"$likesData._id"}},
            {$project:{likesData:0}},
            {$lookup:{
                from:"users",
                localField:"applicants",
                foreignField:"_id",
                as:"usersData"
            }},
            {$addFields:{users:"$usersData.name"}},
            {$project:{usersData:0, applicants:0}},
            {$project:{__v:0}}
        ])
        if(jobs.length<=0){
            return res.status(200).json({
                status:"Failed",
                message:"Job for the given filter doesn't exist"
            })
        }
        res.status(200).json({
            status:"Success",
            data:jobs
        })
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({
            status:"Error",
            message:error.message
        })
    }
}

// 67f63cc3762c431fd0de989b