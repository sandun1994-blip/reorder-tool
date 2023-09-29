import getCurrentUser from "@/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import axios from "axios";

export async function GET(request: NextRequest,{ params }:{params:{stockcode:string}}) {
    
  try {
    const token = await getCurrentUser();
    const user = jwt.verify(token as string, process.env.JWT_SECRET as string);

    const config = {
      method: "get",
      url: process.env.BASE_URL + "billomatlines/bystockcode/" + params.stockcode,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const bhdrData = await axios(config);

    return NextResponse.json(bhdrData.data);
  } catch (error) {
    console.log(error);

    return new NextResponse("Unauthorized", { status: 400 });
  }
}
