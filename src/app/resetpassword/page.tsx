"use client"
import axios from "axios"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast, {Toaster} from "react-hot-toast";

export default function ResetPassword() {
    
    const [token, setToken] = useState<string | null>(null); 
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)    
    
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);                
        setToken(urlParams.get("token"));
    }, []);    

    const onSubmit = async () => {
        setLoading(true)
        try {            
            
            if(password !== confirmPassword) {
                toast.error("Both passwords must match")
                setLoading(false)
            }

            if(!token) {
                toast.error("Invalid token")
                setLoading(false)
            }            
            
            const response = await axios.post("/api/users/resetpassword", {
                token, 
                newPassword: password
            })            
            
            console.log("Password reset successfully", response.data);
            toast.success("Password reset successfully")
            router.push("/login")

            
        } catch (error: any) {
            setMessage(error.response?.data?.error || "Something went wrong");
            toast.error(error.response?.data?.error || "Something went wrong");          
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setButtonDisabled(password.length === 0 || confirmPassword.length === 0)
    }, [password, confirmPassword]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-6">
          <Toaster />
          <div className="bg-gray-500 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-4 text-black">Reset Password</h2>
    
            {loading && <p className="text-blue-500 text-center mb-2">Processing...</p>}
    
            <label htmlFor="password" className="block text-black font-medium">
              New Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 my-2 text-black"
            />
    
            <label htmlFor="confirmPassword" className="block text-black font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 my-2 text-black"
            />
    
            <button
              onClick={onSubmit}
              disabled={loading || buttonDisabled}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
    
            {message && <p className="text-red-500 text-center mt-2">{message}</p>}
          </div>
        </div>
      );
}