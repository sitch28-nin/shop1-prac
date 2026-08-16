import { supabase } from "@/lib/supabase";
import Link from "next/link";

const ProductsPage = async () => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .is("deleted_at", null);

  if (error) {
    return (
      <div className="page-shell">
        <div className="panel p-6 text-slate-700">เกิดข้อผิดพลาดขึ้นกับการโหลดสินค้า</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-8">
        <span className="soft-badge mb-4">Collection</span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          รายการสินค้า
        </h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group panel overflow-hidden p-3 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]"
          >
            <div className="aspect-square overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f5efe7] via-[#ece2d1] to-[#d8c9ae]" />

            <div className="mt-4 flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-900">{product.name_product}</h2>
              {product.stock === 0 && (
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  หมด
                </span>
              )}
            </div>
            <p className="mt-2 text-lg font-bold text-emerald-800">
              {product.price.toLocaleString()} บาท
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;