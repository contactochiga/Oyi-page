export type CartLine = { product: string; sku: string; quantity: number };
export const CART_KEY = "getoyi-hardware-cart-v1";
export function validCart(value: unknown): value is CartLine[] {
  return (
    Array.isArray(value) &&
    value.length <= 50 &&
    value.every(
      (l) =>
        l &&
        typeof l === "object" &&
        Object.keys(l).every((k) =>
          ["product", "sku", "quantity"].includes(k),
        ) &&
        typeof l.product === "string" &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(l.product) &&
        l.product.length <= 80 &&
        typeof l.sku === "string" &&
        /^[A-Z0-9][A-Z0-9_-]{0,79}$/.test(l.sku) &&
        Number.isInteger(l.quantity) &&
        l.quantity >= 1 &&
        l.quantity <= 1000,
    ) &&
    new Set(value.map((l) => l.sku)).size === value.length
  );
}
export function readCart(): CartLine[] {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return validCart(value) ? value : [];
  } catch {
    return [];
  }
}
export function saveCart(lines: CartLine[]) {
  if (!validCart(lines)) throw Error("Choose a quantity between 1 and 1,000.");
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("hardware-cart"));
}
export function addCart(line: CartLine) {
  const lines = readCart(),
    existing = lines.find((l) => l.sku === line.sku);
  if (existing) existing.quantity += line.quantity;
  else lines.push(line);
  saveCart(lines);
}
export const STATES =
  "Abia|Adamawa|Akwa Ibom|Anambra|Bauchi|Bayelsa|Benue|Borno|Cross River|Delta|Ebonyi|Edo|Ekiti|Enugu|FCT|Gombe|Imo|Jigawa|Kaduna|Kano|Katsina|Kebbi|Kogi|Kwara|Lagos|Nasarawa|Niger|Ogun|Ondo|Osun|Oyo|Plateau|Rivers|Sokoto|Taraba|Yobe|Zamfara".split(
    "|",
  );
export const money = (kobo: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    kobo / 100,
  );
export type Reservation = {
  id: string;
  state: "held" | "released" | "expired" | "allocated";
  expires_at: string;
};
export type Quote = {
  reservation_ttl_seconds?: number | null;
  lines: {
    sku: string;
    name: string;
    variant: string;
    options: Record<string, string>;
    quantity: number;
    unit_price_kobo: number;
    gross_kobo: number;
    tax_kobo: number;
  }[];
  goods_total_kobo: number;
  goods_tax_kobo: number;
  delivery_total_kobo: null;
  payable_total_kobo: null;
  payment_eligible: false;
};
