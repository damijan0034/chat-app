"use client"

import Loader from '@/components/Loader'
import { PersonOutline } from '@mui/icons-material'
import { useSession} from 'next-auth/react'
import {CldUploadButton} from "next-cloudinary"
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Profile = () => {
    const {data:session}=useSession()
    const user=session?.user

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState:{error}
    }=useForm()

    const uploadPhoto=(result)=>{
        setValue("profileImage",result?.info?.secure_url)
    }

    const[loading,setLoading]=useState(true)

    useEffect(()=>{
        if(user){
            reset({
                username:user?.username,
                profileImage:user?.profileImage
            })
         
        }
        setLoading(false)
    },[user])

    const updateUser=async (data)=>{
        setLoading(true)
        try {
            const res=await fetch(`/api/users/${user._id}/update`,{
                method:"POST",
                headers:{
                    "Content-Type":"aplication/json"
                },
                body:JSON.stringify(data)
            })
            setLoading(false)
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }

  return loading ? <Loader /> :
   (
    <div className='profile-page'>
        <h1 className='text-heading3-bold'>Edit your profile</h1>
        <form className='edit-profile' onSubmit={handleSubmit(updateUser)} >
            <div className="input">
                <input type="text" className='input-field' 
                placeholder='User Name'
                {...register("username",{
                    required:"User Name is required",
                    validate:(value)=>{
                        if(value.length<3){
                            return "Username must be more than 3 characters"
                        }
                    }
                }
  )}
                />
                <PersonOutline sx={{color:"#737373"}} />
            </div>
            {error?.username && (
                <p className='text-red-500'>{error.username.message}</p>
            )}
            <div className='flex items-center justify-between'>
                <img src={watch("profileImage")  || user?.profileImage || "/assets/person.jpg"} 
                alt="profile image"
                className='rounded-full w-40 h-40'
                />
                <CldUploadButton 
                    options={{maxFiles:1}}
                    onSuccess={uploadPhoto}
                    uploadPreset="bgvmkhum"

                >
                    <p className='text-body-bold'>Upload new photo</p>
                </CldUploadButton>
               
            </div>
            <button className='btn' type="submit">Save Changes</button>
           
        </form>
    </div>
  )
}

export default Profile