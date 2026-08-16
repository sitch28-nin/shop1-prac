'use client';

import { useCartStore } from "@/lib/cart-store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CheckoutPage = () => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("กรุณาเข้าสู่ระบบก่อน");
      setLoading(false);
      return;
    }

    const productIds = items.map((item) => item.id);
    const { data: products, error: productError } = await supabase
      .from("products")
      .select("id, name_product, stock")
      .in("id", productIds);

    if (productError || !products) {
      setError("ไม่สามารถตรวจสอบสต็อกสินค้าได้");
      setLoading(false);
      return;
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.id);

      if (!product) {
        setError(`ไม่พบสินค้า ${item.name_product} ในระบบ`);
        setLoading(false);
        return;
      }

      if (product.stock < item.quantity) {
        setError(`${product.name_product} เหลือแค่ ${product.stock} ชิ้น (ต้องการ ${item.quantity} ชิ้น)`);
        setLoading(false);
        return;
      }
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total })
      .select()
      .single();

    if (orderError || !order) {
      setError("เกิดข้อผิดพลาดในการสร้างออเดอร์");
      setLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      setError("เกิดข้อผิดพลาดในการบันทึกสินค้า");
      setLoading(false);
      return;
    }

    clearCart();
    router.push(`/orders/${order.id}`);
  };

  return (
    <div className="page-shell">
      <h1 className="mb-8 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        สรุปคำสั่งซื้อ
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="panel p-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.name_product}</p>
                  <p className="text-sm text-slate-500">x {item.quantity}</p>
                </div>
                <span className="font-semibold text-emerald-800">
                  {(item.price * item.quantity).toLocaleString()} บาท
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="panel h-fit p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total</p>
          <div className="mt-2 text-3xl font-black text-emerald-800">{total.toLocaleString()} บาท</div>

          <button onClick={handleCheckout} disabled={loading} className="primary-btn mt-6 w-full">
            {loading ? "กำลังดำเนินการ..." : "ยืนยันคำสั่งซื้อ"}
          </button>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;