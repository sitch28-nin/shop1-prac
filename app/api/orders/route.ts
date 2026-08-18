import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const { items } = body; 

    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
            { error: "ต้องมีสินค้าอย่างน้อย 1 รายการ"},
            { status: 400 }
        );
    }

    for (const item of items) {
        const validProductId = Number.isInteger(item.productId) && item.productId > 0;
        const validQuantity = Number.isInteger(item.quantity) && item.quantity > 0;

        if (!validProductId || !validQuantity) {
            return NextResponse.json(
                { error : "ข้อมูลสินค้าไม่ถูกต้อง"},
                { status: 400 }
            );
        }
    }

    console.log("ข้อมูลผ่าน validation : ", items);


    return NextResponse.json({
        message: "ข้อมูลถูกต้อง",
        items,
    });
}