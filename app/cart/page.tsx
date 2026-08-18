'use client';

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);

  const total = items.reduce((sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0), 0);
  const itemCount = items.reduce((sum, item) => sum + (item?.quantity ?? 0), 0);

  if (items.length === 0) {
    return (
      <div className="page-shell">
        <div className="panel p-10 text-center">
          <p className="soft-badge mb-4">Empty cart</p>
          <h1 className="text-3xl font-black text-slate-900">ตะกร้าของคุณว่างเปล่า</h1>
          <p className="mt-3 text-slate-600">เพิ่มสินค้าก่อนเพื่อเริ่มช้อปปิ้ง</p>
          <Link href="/products" className="primary-btn mt-6">
            เลือกซื้อสินค้า
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="soft-badge mb-3">Cart</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            ตะกร้าสินค้า
          </h1>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
          {itemCount} รายการ
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-4">
          {items.map((item) => {
            const isAtStockLimit = item.quantity >= item.stock;
            return(
            <div
              key={item.id}
              className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">{item.name_product}</h2>
                <p className="mt-1 text-sm text-slate-500">ราคาต่อชิ้น {item.price.toLocaleString()} บาท</p>
                <button onClick={() => increaseItem(item.id)} disabled={isAtStockLimit} className="bg-black border rounded-2xl px-2.5 text-white cursor-pointer">
                  {isAtStockLimit ? "ถึงจำนวนสูงสุดแล้ว" : "+"}
                </button>
                <p className="mt-1 text-sm text-slate-500">จำนวน {item.quantity} ชิ้น</p>
                <button onClick={() => decreaseItem(item.id)} className="bg-black border rounded-2xl px-3 text-white cursor-pointer">-</button>
              </div>

              <div className="flex items-center gap-4 sm:justify-end">
                <span className="text-lg font-bold text-emerald-800">
                  {(item.price * item.quantity).toLocaleString()} บาท
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="secondary-btn px-3 py-2 text-sm"
                >
                  ลบ
                </button>
              </div>
            </div>
          );
        })}
        </div>

        <aside className="panel h-fit p-6">
          <h2 className="text-xl font-bold text-slate-900">สรุปคำสั่งซื้อ</h2>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>จำนวนสินค้า</span>
              <span>{itemCount} ชิ้น</span>
            </div>
            <div className="flex items-center justify-between">
              <span>ค่าบริการ</span>
              <span>ฟรี</span>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between text-slate-600">
              <span>ยอดรวม</span>
              <span className="text-2xl font-bold text-emerald-800">{total.toLocaleString()} บาท</span>
            </div>
          </div>

          <Link href="/checkout" className="primary-btn mt-6 w-full">
            ดำเนินการชำระเงิน
          </Link>
          <button onClick={clearCart} className="primary-btn mt-6 w-full">ล้างตะกร้า</button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;