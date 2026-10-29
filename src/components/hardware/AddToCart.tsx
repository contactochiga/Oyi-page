"use client";
import { useState } from "react";
import Link from "next/link";
import { addCart } from "@/lib/checkout/cart";
export function AddToCart({ product, sku }: { product: string; sku: string }) {
  const [quantity, setQuantity] = useState(1),
    [message, setMessage] = useState("");
  return (
    <div className="mt-5 grid gap-3">
      <label>
        Quantity{" "}
        <input
          aria-label="Quantity"
          type="number"
          min="1"
          max="1000"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="ml-3 w-24 rounded border border-slate-300 p-2"
        />
      </label>
      <button
        type="button"
        className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white"
        onClick={() => {
          try {
            addCart({ product, sku, quantity });
            setMessage("Added to your cart.");
          } catch {
            setMessage(
              "Unable to save. Choose a valid quantity and allow browser storage.",
            );
          }
        }}
      >
        Add to Cart
      </button>
      <p role="status">
        {message}{" "}
        <Link href="/hardware/cart" className="text-blue-700 underline">
          View cart
        </Link>
      </p>
    </div>
  );
}
