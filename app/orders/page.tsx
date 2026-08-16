import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const OrderPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="page-shell">
        <div className="panel p-6">กรุณาเข้าสู่ระบบ</div>
      </div>
    );
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !orders) {
    return (
      <div className="page-shell">
        <div className="panel p-6">เกิดข้อผิดพลาดในการโหลดประวัติคำสั่งซื้อ</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-shell">
        <div className="panel p-10 text-center">
          <h1 className="text-3xl font-black text-slate-900">ยังไม่มีคำสั่งซื้อ</h1>
          <Link href="/products" className="primary-btn mt-6">
            เริ่มช้อปปิ้ง
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="soft-badge mb-4">History</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          ประวัติคำสั่งซื้อ
        </h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="panel block p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(15,23,42,0.08)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">คำสั่งซื้อ #{order.id}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {Number(order.total).toLocaleString()} บาท
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  order.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : order.status === "paid"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;