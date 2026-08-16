import OrderStatusSelect from "@/components/OrderStatusSelect";
import { createClient } from "@/lib/supabase/server"
import Link from "next/link";

const AdminPage = async() => {
    const supabase = await createClient();

    const { data: products } = await supabase.from("products").select('*').is("deleted_at", null);

    const { data: orders } = await supabase.from("orders").select('*').order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">Admin Dashboard</h1>

        <div className="mt-10">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-[#1a1a1a]">สินค้า</h2>
                <Link href={'/admin/products/new'} className="text-sm text-[#2d4739] underline">+ สินค้าใหม่</Link>
            </div>
            <ul className="mt-4 divide-y divide-[#e5e3dd]">
                {products?.map((product) => (
                    <li key={product.id} className="flex items-center justify-between py-3">
                        <span>{product.name_product}</span>
                        <span>{product.stock} ชิ้น</span>
                        <Link href={`/admin/products/${product.id}`} className="text-sm text-[#2e4739] underline">
                            แก้ไข
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        <div className="mt-12">
            <h2 className="text-xl font-medium text-[#1a1a1a]">ออเดอร์ทั้งหมด</h2>
            <ul className="mt-4 divide-y divide-[#e5e3dd]">
                {orders?.map((order) => (
                    <li key={order.id} className="flex items-center justify-between py-3">
                        <span>#{order.id.slice(0, 8)}</span>
                        <span>{order.total} บาท</span>
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status}/>
                    </li>
                ))}                
            </ul>
        </div>
    </div>
  )
}
export default AdminPage