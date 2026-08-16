'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTION = ["pending", "paid", "shipped", "delivered", "cancelled"];

const OrderStatusSelect = ({ orderId, currentStatus}:{orderId: string, currentStatus: string}) => {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = async(newStatus: string) => {
        setLoading(true);
        setStatus(newStatus);

        const supabase = createClient();
        const { error } = await supabase.from('orders').update({ status: newStatus}).eq('id', orderId);

        if (error) {
            setStatus(currentStatus);
            alert("เปลี่ยนสถานะไม่สำเร็จ: " + error.message);
        }

        setLoading(false);
        router.refresh();
    };

  return (
    <select
    value={status}
    disabled={loading}
    onChange={(e) => handleChange(e.target.value)}
    className="border border-[#e5e3dd] px-2 py-1 text-sm"
    >
        {STATUS_OPTION.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
    </select>
    )
}

export default OrderStatusSelect