'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";


type Product = {
    id: number;
    name_product: string;
    price: number;
    stock: number;
}
const ProductForm = ({ product }:{product?: Product}) => {
    const isEditing = !!product;
    const [name, setName] = useState(product?.name_product ?? "");
    const [price, setPrice] = useState(product?.price?.toString() ?? "");
    const [stock, setStock] = useState(product?.stock?.toString() ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async() => {
        setLoading(true);
        setError("");

        const supabase = createClient();
        const payload = {
            name_product: name,
            price: parseFloat(price),
            stock: parseInt(stock),
        };

        if (isEditing) {
            const { error } = await supabase.from('products').update(payload).eq('id', product.id);

            if (error) {
                setError("บันทึกไม่สำเร็จ:" + error.message);
                setLoading(false);
                return;
            }
        } else {
            const { error } = await supabase.from('products').insert(payload);

            if (error) {
                setError("เพิ่มสินค้าไม่สำเร็จ" + error.message);
                setLoading(false);
                return;
            }
        }

        router.push('/admin');
        router.refresh();
    }

    const handleDelete = async() => {
        if (!product) return;
        if (!confirm(`ต้องการลบ "${product.name_product}" ใช่ไหม`)) return;

        setLoading(true);
        const supabase = createClient();

        const { error } = await supabase.from('products').update({ deleted_at: new Date().toISOString() }).eq('id', product.id);

        if (error) {
            setError("ลบไม่สำเร็จ: " + error.message);
            setLoading(false);
            return;
        }

        router.push('/admin');
        router.refresh();
    };

  return (
    <div className="mx-auto max-w-md px-6 py-12">
        <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">
            {isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h1>

        <div className="mt-8 flex flex-col gap-4">
            <div>
                <label className="text-sm text-[#1a1a1a]/60">ชื่อสินค้า</label>
                <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-[#e5e3dd] px-3 py-2"
                 />
            </div>

            <div>
                <label className="text-sm text-[#1a1a1a]/60">ราคา (บาท)</label>
                <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full border border-[#e5e3dd] px-3 py-2"
                 />
            </div>

            <div>
                <label className="text-sm text-[#1a1a1a]/60">สต็อก</label>
                <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-1 w-full border border-[#e5e3dd] px-3 py-2"
                 />
            </div>

            <button onClick={handleSubmit} disabled={loading} className="mt-2 bg-[#1a1a1a] py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-[#2d4739}">
                {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>

            {isEditing && (
                <button
                onClick={handleDelete}
                disabled={loading}
                className="py-3 text-sm uppercase tracking-widest text-red-700 underline">
                    ลบสินค้า
                </button>
            )}

            {error && <p className="text-sm text-red-700">{error}</p>}
        </div>


    </div>
  )
}
export default ProductForm