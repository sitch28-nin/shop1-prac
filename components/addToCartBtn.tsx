'use client';

import { useCartStore } from "@/lib/cart-store";

const AddToCartBtn = ({ product }: { product: { id: number; name_product: string; price: number } }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleClick = () => {
    addItem(product);
  };

  return (
    <button
      onClick={handleClick}
      className="primary-btn w-full sm:w-auto"
    >
      เพิ่มลงตะกร้า
    </button>
  );
};

export default AddToCartBtn;