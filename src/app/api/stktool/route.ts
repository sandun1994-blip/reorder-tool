import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const token = await getCurrentUser();
    const user = jwt.verify(token as string, process.env.JWT_SECRET as string);
    // if (!currentUser?.id || !currentUser?.email) {
    //     return new NextResponse('Unauthorized', { status: 400 });
    //   }
   // console.log(token);

    const config = {
      method: "get",
      url: process.env.BASE_URL + "stockrequirement",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const stkData = await axios(config);

    return NextResponse.json(stkData.data);
  } catch (error) {
    console.log(error);

    return new NextResponse("Unauthorized", { status: 400 });
  }
}
