import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    const body = await request.json();

    console.log(body);

    return NextResponse.json({
        message: "ได้รับข้อมูลแล้ว",
        data: body,
    });
}