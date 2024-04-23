"use client"

import ChatList from "@/components/ChatList"
import Contacts from "@/components/Contacts"
import { useSession } from "next-auth/react"

const Chats = () => {
    const{data:session}=useSession()
    console.log(session)
  return (
    <div className="main-container">
      <div className="w-1/3 max-md:w-1/2 max-sm:w-full">
          <ChatList />
      </div>
      <div className="w-2/3 max-md:w-1/2 max-sm:hidden">
        <Contacts />
      </div>
    </div>
  )
}

export default Chats