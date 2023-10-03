import getCurrentUser from "@/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import axios from "axios";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const token = await getCurrentUser();
    const user: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    const config = {
      method: "Delete",
      url: process.env.BASE_URL + "reodertool/pauseitem/" + params.id,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const item = await axios(config);

    return NextResponse.json(item.data);
  } catch (error) {
    console.log(error);

    return new NextResponse("Error", { status: 500 });
  }
}
