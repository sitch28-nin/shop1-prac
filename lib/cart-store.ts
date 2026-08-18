import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
    id: number;
    name_product: string;
    price: number;
    quantity: number;
    stock: number;
};

type CartStore = {
    items: CartItem[];
    addItem: (product: {id : number; name_product: string; price: number; stock: number}) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    increaseItem: (id: number) => void;
    decreaseItem: (id: number) => void;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (product) =>
                set((state) => {
                    const existing = state.items.find((item) => item.id === product.id);
                    if (existing) {
                        if (existing.quantity >= existing.stock) {
                            return {
                                items: state.items
                            };
                        }
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
            increaseItem: (id) =>
                set((state) => {
                    const item = state.items.find((item) => item.id === id);
                    if (!item) {
                        return {
                            items: state.items
                        };
                    }
                    if (item.quantity < item.stock) {
                        return {
                            items: state.items.map((item) => item.id === id ? {...item, quantity: item.quantity + 1} : item)
                        };
                    }
                    if (item.quantity >= item.stock) {
                        return {
                            items: state.items
                        };
                    }
                }),
            decreaseItem: (id) => 
                set((state) => {
                    const item = state.items.find((item) => item.id === id);
                    if (!item) {
                        return {
                            items: state.items
                        };
                    }
                    if (item.quantity === 1) {
                        return {
                            items: state.items.filter((item) => item.id !== id)
                        };
                    }
                    return {
                        items: state.items.map((item) => item.id === id ? {...item, quantity: item.quantity - 1} : item)
                    };
                }),
        }),
        {name: "cart-storage"}
    )
);