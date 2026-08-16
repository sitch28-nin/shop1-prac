import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
    id: number;
    name_product: string;
    price: number;
    quantity: number;
};

type CartStore = {
    items: CartItem[];
    addItem: (product: {id : number; name_product: string; price: number}) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (product) =>
                set((state) => {
                    const existing = state.items.find((item) => item.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map((item) => 
                                item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                        ), 
                    };
                }
                return {items: [...state.items, {...product, quantity: 1}]};
            }),
            removeItem: (id) => 
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),
            clearCart: () => set({ items: []}),
        }),
        {name: "cart-storage"}
    )
);
