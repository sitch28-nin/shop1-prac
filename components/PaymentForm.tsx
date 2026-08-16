'use client';

import { useState } from "react";

declare global {
  interface Window {
    Omise: any;
  }
}

const PaymentFormPage = ({ orderId, total }: { orderId: string; total: number }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = () => {
    setLoading(true);
    setError("");

    window.Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY!);

    window.Omise.createToken(
      "card",
      {
        name,
        number: cardNumber,
        expiration_month: expMonth,
        expiration_year: expYear,
        security_code: cvv,
      },
      async (statusCode: number, response: any) => {
        if (statusCode !== 200) {
          setError(response.message || "ข้อมูลบัตรไม่ถูกต้อง");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.id, orderId, amount: total }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "การชำระเงินไม่สำเร็จ");
          setLoading(false);
          return;
        }

        window.location.href = `/orders/${orderId}`;
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="ชื่อบนบัตร"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-900"
        />
        <input
          type="text"
          placeholder="เลขบัตร"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="input-field border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-900"
        />
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="MM"
            value={expMonth}
            onChange={(e) => setExpMonth(e.target.value)}
            className="input-field border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-900"
          />
          <input
            type="text"
            placeholder="YYYY"
            value={expYear}
            onChange={(e) => setExpYear(e.target.value)}
            className="input-field border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-900"
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="input-field border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-900"
          />
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "กำลังดำเนินการ..." : `จ่าย ${total.toLocaleString()} บาท`}
      </button>

      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}
    </div>
  );
};

export default PaymentFormPage;