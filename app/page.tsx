
import Link from "next/link";

const Home = () => {
  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-10 px-6 py-10 md:grid-cols-2 md:px-12 md:py-16">
          <div className="flex flex-col justify-center">
            <span className="soft-badge mb-4 w-fit">New Collection</span>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Styled essentials for everyday living
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              Discover beautiful everyday products designed to make your home and lifestyle feel more refined.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="primary-btn">
                Shop now
              </Link>
              <Link href="/login" className="secondary-btn">
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-56 rounded-[28px] bg-gradient-to-br from-[#f1e7d8] via-[#e9dbc1] to-[#d8c4a0]" />
            <div className="mt-8 h-56 rounded-[28px] bg-gradient-to-br from-[#dfeae1] via-[#c7d9ce] to-[#abc0ae]" />
            <div className="col-span-2 h-56 rounded-[28px] bg-gradient-to-br from-[#eef1f4] via-[#dfe4ea] to-[#c4ced9]" />
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { title: "Fast delivery", text: "ส่งภายใน 2–4 วัน" },
          { title: "Secure checkout", text: "ชำระเงินปลอดภัย" },
          { title: "Trusted quality", text: "สินค้าคุณภาพสูง" },
        ].map((feature) => (
          <div key={feature.title} className="panel p-6">
            <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-slate-600">{feature.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;