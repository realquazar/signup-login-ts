import {connect} from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailers";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email} = reqBody
        console.log(reqBody);

        const user = await User.findOne({email})

        if(!user) {
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        await sendEmail({email, emailType: "RESET", userId: user._id})

        return NextResponse.json({
            message: "Email sent successfully",
            success: true
        }, {status: 200})
        
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
        
    }

}