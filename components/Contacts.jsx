"use client"

import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import { useRouter } from 'next/navigation'

const Contacts = () => {
    const { data: session } = useSession()
    const currentUser = session?.user

    console.log(currentUser);

    const [loading, setLoading] = useState(true)
    const [contacts, setContacts] = useState([])
    const [search, setSearch] = useState("")

    const getContacts = async () => {
        try {
            const res = await fetch(
                search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
            )
            const data = await res.json()

            setLoading(false)
            setContacts(data.filter((contact) => contact._id != currentUser._id))


        } catch (error) {
            console.log(error);
        }

    }



    useEffect(() => {
        if (currentUser) {
            getContacts()
        }

    }, [currentUser, search])

    /* SELECT CONTACT */
    const [selectedContacts, setSelectedContacts] = useState([]);
    const isGroup = selectedContacts.length > 1;

    const handleSelect = (contact) => {
        if (selectedContacts.includes(contact)) {
            setSelectedContacts((prevSelectedContacts) =>
                prevSelectedContacts.filter((item) => item !== contact)
            );
        } else {
            setSelectedContacts((prevSelectedContacts) => [
                ...prevSelectedContacts,
                contact,
            ]);
        }
    };

    /* ADD GROUP CHAT NAME */
    const [name, setName] = useState("");

    const router = useRouter();

    /* CREATE CHAT */
    const createChat = async () => {
        const res = await fetch("/api/chats", {
            method: "POST",
            body: JSON.stringify({
                currentUserId: currentUser._id,
                members: selectedContacts.map((contact) => contact._id),
                isGroup,
                name,
            }),
        });
        const chat = await res.json();

        if (res.ok) {
            router.push(`/chats/${chat._id}`);
        }
    };

    return loading ? (<Loader />) : (
        <div className='create-chat-container'>
            <input
                placeholder='Search contact...'
                className='input-search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="content-bar">
                <div className="content-list">
                    <p className='text-body-bold'>Select or deselect</p>
                    <div className="flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar">
                        {
                            contacts.map((user, index) => (
                                <div key={index}
                                    className='contact'
                                    onClick={() => handleSelect(user)}
                                >
                                    {selectedContacts.find((item) => item === user) ? (
                                        <CheckCircle sx={{ color: "red" }} />
                                    ) : (
                                        <RadioButtonUnchecked />
                                    )}
                                    <img src={user.profileImage || "/assets/person.jpg"}
                                        alt="person"
                                        className='profilePhoto'
                                    />
                                    <p className='text-base-bold'>{user.username}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="create-chat">
                    {
                        isGroup && (
                            <>
                                <div className="flex flex-col gap-3">
                                    <p className="text-body-bold">
                                        Group chats name
                                    </p>
                                    <input
                                        placeholder="Enter group chat name..."
                                        className="input-group-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p className="text-body-bold">Members</p>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedContacts.map((contact, index) => (
                                            <p className="selected-contact" key={index}>
                                                {contact.username}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )
                    }
                    <button  onClick={createChat} className="btn">START A NEW CHAT</button>

                </div>
            </div>
        </div>
    )
}

export default Contacts