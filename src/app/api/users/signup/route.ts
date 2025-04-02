import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {sendEmail} from "@/helpers/mailers";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        console.log(reqBody);

        if(!username) {
            return NextResponse.json({error: "Username is required"}, {status: 400})
        }
        if(!email) {
            return NextResponse.json({error: "Email is required"}, {status: 400})
        }
        if(!password) {
            return NextResponse.json({error: "Password is required"}, {status: 400})
        }

        // Check if user exists
        const user = await User.findOne({email})

        if(user) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);

        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})
        
        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
        
        
    } catch (error: any) {
        console.log(error);
        
        return NextResponse.json({error: error.message}, {status: 500})
        
    }
}