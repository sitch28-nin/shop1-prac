import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    const supabase = await createClient();
    const { data: { user }} = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json(
            { error: "กรุณาเข้าสู่ระบบก่อน"},
            { status: 401 }
        );
    }

    const productIds = [...new Set(items.map((item) => item.productId)),];

    const { data: products, error: productsError } = await supabase.from('products').select("id, name_product, price, stock").in("id", productIds).is("deleted_at", null);

    if (productsError) {
        return NextResponse.json(
            { error: "ไม่สามารถโหลดข้อมูลสินค้าได้"},
            { status: 500 }
        );
    }   

    if (!products || products.length !== productIds.length) {
        return NextResponse.json(
            { error: "ไม่พบสินค้าบางรายการ"},
            { status: 400}
        );
    }

    let total = 0;

    for (const item of items) {
        const product = products.find((product) => product.id === item.productId);
        if (!product) {
            return NextResponse.json(
                { error: "ไม่พบสินค้า" },
                { status: 400 }
            );
        }

        if (item.quantity > product.stock) {
            return NextResponse.json(
                { error: `${product.name_product} มีสินค้าเหลือไม่เพียงพอ` },
                { status: 400 }
            );
        }

        total += product.price * item.quantity;
    }

    

    return NextResponse.json({
        message: "ข้อมูลถูกต้อง",
        items,
        total,
    });
}