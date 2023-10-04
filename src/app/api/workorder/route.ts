import getCurrentUser from "@/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const token = await getCurrentUser();
    const user: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    const body = await request.json();

    const config = {
      method: "POST",
      url: process.env.BASE_URL + "workorder/wo/woline",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { data: body, user },
    };

    const workOrder = await axios(config);

    return NextResponse.json(workOrder.data);
  } catch (error) {
    
    return new NextResponse("Error", { status: 500 });
  }
}
