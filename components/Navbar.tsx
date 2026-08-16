import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-2xl font-black tracking-[0.25em] text-slate-900">
          SHOP
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/products" className="transition hover:text-emerald-800">
            Products
          </Link>
          <Link href="/cart" className="transition hover:text-emerald-800">
            Cart
          </Link>
          <Link href="/checkout" className="transition hover:text-emerald-800">
            Checkout
          </Link>

          {user ? (
            <>
              <span className="text-emerald-800">สวัสดี {user.email}</span>
              <Link href="/orders" className="transition hover:text-emerald-800">
                ประวัติคำสั่งซื้อ
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="transition hover:text-emerald-800">
                เข้าสู่ระบบ
              </Link>
              <Link href="/signup" className="primary-btn px-4 py-2 text-xs uppercase tracking-[0.16em]">
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;