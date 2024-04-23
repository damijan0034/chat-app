"use client"

import { EmailOutlined, LockOutlined, PersonOutline } from '@mui/icons-material'
import Link from 'next/link'
import {signIn} from "next-auth/react"
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


const Form = ({ type }) => {
    const router=useRouter()
   
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();

      const onSubmit=async (data)=>{
        if(type === "register"){
            const res=await fetch("/api/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"aplication/json"
                },
                body:JSON.stringify(data)
            }
                
            )
            if(res.ok){
                router.push("/")
            }
            if(res.error){
                toast.error("Something went wrong")
            }
        }

        if(type === "login"){
            const res=await signIn("credentials",{
                ...data,
                redirect:false
            })
            if(res.ok){
                router.push("/chats")
            }
            if(res.error){
                toast.error("Email or  password invalid")
            }
        }
        
       
      }
    return (
        <div className='auth' >
            <div className='content'>
                <img src="/assets/logo.png" alt="logo" className='logo' />
                <form className='form' onSubmit={handleSubmit(onSubmit)}>
                    {
                        type === "register" && (
                            <div>
                                <div className='input'>
                                    <input type="text" placeholder='User Name'
                                        className='input-field'
                                        defaultValue=""
                                        {...register("username",{
                                           required:"User Name is required",
                                           validate:(value)=>{
                                            if(value.length < 2 ){
                                              return "User must have more than 2 characters"  
                                            }
                                           } 
                                        })}
                                    />
                                    <PersonOutline sx={{ color: "#737373" }} />
                                </div>
                                {errors.username && (
                                    <p className='text-red-500'>{errors.username.message}</p>
                                )}
                            </div>
                        )
                    }
                    <div>
                        <div className='input'>
                            <input type="email" placeholder='Email'
                                className='input-field'
                                defaultValue=""
                                {...register("email",{
                                    required:"Email is required"
                                },)}
                            />
                            <EmailOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.email && (
                            <p className='text-red-500'>{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <div className='input'>
                            <input type="password" placeholder='Password'
                                className='input-field'
                                defaultValue=""
                                {
                                    ...register("password",{
                                        required:"Password is required",
                                        validate:(value)=>{
                                            if(value.length<5){
                                                return "Password must be at least 5 "
                                            }
                                        }
                                    },)
                                }
                            />
                            <LockOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.password && (
                            <p className='text-red-500'>{errors.password.message}</p>
                        )}
                    </div>
                    <button className='button' type="submit">
                        {
                            type === "register" ? "Join Free" :
                            "Lets Chat"
                        }
                    </button>
                </form>
                {
                    type === "register" ? (
                        <Link className='link' href="/">
                            <p>Already have an account?Login here</p>
                        </Link>
                    ) :
                    (
                        <Link className='link' href="register">
                            <p>Dont have an account? Register Here</p>
                    </Link>
                    )
                }
            </div>
        </div>
    )
}

export default Form