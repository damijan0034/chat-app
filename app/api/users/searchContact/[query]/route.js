import User from "@/models/User";
import { connectToDB } from "@/mongodb"

export const GET=async (req,{params})=>{
    try {
        connectToDB();

        const {query}=params;

        const searchedContact=await User.find({
            $or:[
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        })

        return new Response(JSON.stringify(searchedContact),{status:200})
    } catch (error) {
        return new Response("Failed to fetch search",{status:500})
    }
    
}