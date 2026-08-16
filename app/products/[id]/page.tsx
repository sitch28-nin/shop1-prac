import { supabase } from "@/lib/supabase";
import AddToCartBtn from "@/components/addToCartBtn";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return (
      <div className="page-shell">
        <div className="panel p-6 text-slate-700">ไม่พบสินค้า</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="panel overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="aspect-square rounded-[28px] bg-gradient-to-br from-[#f5efe7] via-[#ece2d1] to-[#d8c9ae]" />

          <div>
            <span className="soft-badge mb-4">Featured</span>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {product.name_product}
            </h1>

            <p className="mt-5 text-3xl font-black text-emerald-800">
              {product.price.toLocaleString()} บาท
            </p>

            <div className="mt-5 flex items-center gap-3 text-slate-600">
              <span className="text-sm uppercase tracking-[0.18em]">Stock</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {product.stock} ชิ้น
              </span>
            </div>

            <div className="mt-8">
              <AddToCartBtn product={{ id: product.id, name_product: product.name_product, price: product.price }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;