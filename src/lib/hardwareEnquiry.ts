// Bounded identifiers only. Product details are resolved again on the server before intake.
export function hardwareEnquiryContext(product: unknown, sku: unknown) {
  const productSlug =
    typeof product === "string" &&
    product.length <= 80 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product)
      ? product
      : "";
  const variantSku =
    productSlug &&
    typeof sku === "string" &&
    /^[A-Z0-9][A-Z0-9._-]{1,63}$/.test(sku)
      ? sku
      : "";
  return { product: productSlug, sku: variantSku };
}
export function hardwareEnquiryQuery(product: string, sku = "") {
  const context = hardwareEnquiryContext(product, sku);
  const params = new URLSearchParams({
    type: "tech_oem",
    product: context.product,
  });
  if (context.sku) params.set("sku", context.sku);
  return params.toString();
}
