import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const RoomGuard = ({ roomId }) => {

    const [pin, setPin] = useState("")
    const [error, setError] = useState("")

    const router = useRouter();

  const handleRoomEnter = async() => {
    if(!pin) {
        setError("Enter a pin for this room!")
    }
    try {
        setError("")
    const rawApi = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const API = rawApi && rawApi !== 'undefined' && rawApi !== 'null' ? rawApi : 'http://localhost:8080'
    const { data } = await axios.post(
      `${API}/api/room/enter`,
      { id: roomId, pin },
      { withCredentials: true }
    );
        if(data) router.push(`/room/${data._id}`)
        window.location.reload()
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setError("Invalid room pin!")
        } else {
            setError(error.response?.data?.message || "Something went wrong, try again!")
        }
    }
  }

  return (
        <div className="fixed top-0 right-0 h-screen w-screen  bg-black/50 flex items-center justify-center z-100">
            <div className="rounded-md bg-white shadow-md h-fit w-4/5 z-100 p-5" onClick={(e) => e.stopPropagation()}>
              <label>You need a pin to access this room.</label>
              <input type="number" value={pin} onChange={(e)=> setPin(e.target.value)} className="border-1 border-[#d3d3d3] mt-2 rounded-md w-full pl-2 py-1" />
              <button 
                onClick={handleRoomEnter}
                className="mt-3 bg-[#a4161a] text-white font-bold text-md rounded-md h-8 px-4"
              >
                Enter
              </button> <br />
              {error && <p className='text-[#a4161a] text-sm'>{error}</p>}
            </div>
        </div>
  )
}

export default RoomGuard