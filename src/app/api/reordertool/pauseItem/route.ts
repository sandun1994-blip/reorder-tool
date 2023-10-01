import getCurrentUser from "@/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import axios from "axios";

export async function POST(request: NextRequest) {

    console.log('pause');
    
  try {
    const token = await getCurrentUser();
    const user: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    const body = await request.json();

    const config = {
      method: "POST",
      url: process.env.BASE_URL + "reodertool/addpauseitem",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {...body,insertBy:user.name },
    };

    const sendOrder = await axios(config);

    return NextResponse.json(sendOrder.data);
  } catch (error) {
    console.log(error);
    
    return new NextResponse("Error", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getCurrentUser();
    const user: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );


    const config = {
      method: "GET",
      url: process.env.BASE_URL + "reodertool/getpauseitem",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    };

    const getItems = await axios(config);

    return NextResponse.json(getItems.data);
  } catch (error) {
    console.log(error);
    
    return new NextResponse("Error", { status: 500 });
  }
}
