'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation"

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async() => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    }
  return (
    <button onClick={handleLogout} className="hover:text-[#2D4739] transition-colors cursor-pointer">ออกจากระบบ</button>
  )
}
export default LogoutButton