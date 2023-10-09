import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import getCurrentUserAllData from "@/actions/getUserAllData";

export async function PUT(request: NextRequest,{ params }:{params:{supnumber:string}}) {
  try {
    const data = await getCurrentUserAllData();
    const token =data?.backendTokens?.accessToken
    const user: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );



    const config = {
      method: "PUT",
      url: process.env.BASE_URL + "stockrequirement/refresh/" +params.supnumber ,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    };

    const refresh = await axios(config);
console.log(refresh);

    return NextResponse.json(refresh.data);
  } catch (error) {
    console.log('sup',error);
    return new NextResponse("Error", { status: 500 });
  }
}

// ?.backendTokens?.accessToken