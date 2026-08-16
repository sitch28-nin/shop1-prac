import ProductForm from "@/components/ProductForm";
import { createClient } from "@/lib/supabase/server";

const EditProductPage = async({params}:{params: Promise<{id : string}>}) => {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase.from("products").select("*").eq('id', id).single();

    if (error || !product) {
        return <div className="p-6">ไม่พบสินค้า</div>
    }

  return (
    <ProductForm product={product}/>
  )
}
export default EditProductPage