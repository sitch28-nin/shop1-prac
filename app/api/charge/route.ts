import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(request: NextRequest) => {
    try {
        const { token, orderId, amount } = await request.json();

        const secretKey = process.env.OMISE_SECRET_KEY!;
        const encodeKey = Buffer.from(`${secretKey}:`).toString("base64");

        const omiseRes = await fetch("https://api.omise.co/charges", {
            method: "POST",
            headers: {
                Authorization: `Basic ${encodeKey}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                amount: String(Math.round(amount * 100)),
                currency: "thb",
                card: token,
                "metadata[order_id]": orderId,
            }),
        });

        const chargeData = await omiseRes.json();

        if (!omiseRes.ok || chargeData.status !== "successful") {
            return NextResponse.json(
                { error: chargeData.message || "การชำระเงินไม่สำเร็จ"},
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { error : updateError } = await supabase.from('orders').update({ status: "paid" }).eq("id", orderId);

        if (updateError) {
            return NextResponse.json({ error: "อัปเดตสถานะไม่สำเร็จ" }, { status: 500 }); 
        }

        const { data: orderItems, error: itemsError } = await supabase.from('order_items').select('product_id, quantity').eq('order_id', orderId);

        if (itemsError || !orderItems) {
            return NextResponse.json({ error: "ไม่พบรายการสินค้าในออเดอร์"}, { status:  500 });
        }

        for (const item of orderItems) {
            const { error: stockError } = await supabase.rpc('decrement_stock', {
                product_id_input: item.product_id,
                quantity_input: item.quantity,
            });
            
            if (stockError) {
                console.error(`หักสต็อกไม่สำเร็จ product_id ${item.product_id}: `, stockError.message);
            }
        }

        return NextResponse.json({ success: true });

        

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดของระบบ" }, { status: 500 });
    }

}