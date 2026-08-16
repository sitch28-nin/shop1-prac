import PaymentFormPage from "@/components/PaymentForm";
import { createClient } from "@/lib/supabase/server";

const OrderId = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 shadow-sm">
          ไม่พบคำสั่งซื้อนี้
        </div>
      </div>
    );
  }

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("*, products(name_product)")
    .eq("order_id", id);

  if (itemsError || !orderItems) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-amber-700 shadow-sm">
          เกิดข้อผิดพลาดในการโหลดรายการสินค้า
        </div>
      </div>
    );
  }

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
          Order Summary
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          คำสั่งซื้อสำเร็จ
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.95fr]">
        <section className="panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">หมายเลขคำสั่งซื้อ</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{order.id}</p>
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

          <div className="mt-6 space-y-4">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{item.products.name_product}</p>
                  <p className="text-sm text-slate-500">
                    {item.quantity} ชิ้น × {item.price_at_purchase.toLocaleString()} บาท
                  </p>
                </div>

                <p className="text-base font-semibold text-slate-800">
                  {(item.price_at_purchase * item.quantity).toLocaleString()} บาท
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">จำนวนสินค้า</span>
              <span className="font-medium text-slate-800">{totalItems} รายการ</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-slate-600">ยอดรวม</span>
              <span className="text-2xl font-bold text-emerald-700">
                {Number(order.total).toLocaleString()} บาท
              </span>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_12px_30px_rgba(15,23,42,0.1)] sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Payment</p>
          <h2 className="mt-3 text-2xl font-bold">ชำระเงิน</h2>

          <div className="mt-6 space-y-4 rounded-2xl bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">ยอดที่ต้องชำระ</span>
              <span className="text-xl font-semibold">
                {Number(order.total).toLocaleString()} บาท
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">สถานะ</span>
              <span className="font-medium text-emerald-300">{order.status}</span>
            </div>
          </div>

          {order.status === "pending" && (
            <div className="mt-6">
              <PaymentFormPage orderId={order.id} total={order.total} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default OrderId;