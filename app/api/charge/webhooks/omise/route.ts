import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const POST = async( request: NextRequest) => {
    try {
        const event = await request.json();

        console.log("ได้รับ webhook: ", event.key);

        if (event.key === "charge.complete" || event.key === "charge.create") {
            const charge = event.data;

            if (charge.status === "successful") {
                const orderId = charge.metadata?.order_id;

                if (!orderId) {
                    console.error("ไม่พบ order_id ใน metadata ของ charge");
                    return NextResponse.json({ received: true });
                }

                const supabase = await createClient();
                const { error } = await supabase.from('orders').update( {status: "paid"} ).eq("id", orderId).eq("status", "pending");

                if (error) {
                    console.error("อัปเดต order จาก webhook ไม่สำเร็จ: ", error.message);
                }
            }
        }
        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("Webhook error: ", err);
        return NextResponse.json({ error: "Webhook processing failed"}, { status: 500 });
    }
}