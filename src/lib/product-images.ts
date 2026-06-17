import type { Category, Product } from "@/data/products";
import placa from "@/assets/placa.png";
import processador from "@/assets/processador.png";
import fan from "@/assets/fan.png";
import gabineteAsset from "@/assets/gabinete.png.asset.json";

export const CATEGORY_IMAGE: Record<Category, string> = {
  "placa-de-video": placa,
  processador: processador,
  fan: fan,
  gabinete: gabineteAsset.url,
  fonte: fan,
  "memoria-ram": processador,
  ssd: processador,
};

// Auto-discovers any per-product image saved as src/assets/products/<id>.jpg.
// Add a file with the product id as its name and it maps automatically.
const PRODUCT_IMAGE_MODULES = import.meta.glob<string>(
  "../assets/products/*.jpg",
  { eager: true, import: "default", query: "?url" },
);

const PRODUCT_IMAGE_BY_ID: Record<string, string> = {};
for (const [path, url] of Object.entries(PRODUCT_IMAGE_MODULES)) {
  const id = path.split("/").pop()?.replace(".jpg", "");
  if (id) PRODUCT_IMAGE_BY_ID[id] = url as string;
}

/** Returns the image specific to a product, falling back to its category image. */
export function productImage(product: Pick<Product, "id" | "category">): string {
  return PRODUCT_IMAGE_BY_ID[String(product.id)] ?? CATEGORY_IMAGE[product.category];
}

/** Generic image for a category (used outside a product context). */
export function categoryImage(category: Category): string {
  return CATEGORY_IMAGE[category];
}