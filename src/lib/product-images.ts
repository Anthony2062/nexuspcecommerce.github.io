import type { Category } from "@/data/products";
import placa from "@/assets/placa.png";
import processador from "@/assets/processador.png";
import fan from "@/assets/fan.png";
import gabineteAsset from "@/assets/gabinete.png.asset.json";

export const CATEGORY_IMAGE: Record<Category, string> = {
  "placa-de-video": placa,
  processador: processador,
  fan: fan,
  gabinete: gabineteAsset.url,
};

export function productImage(category: Category): string {
  return CATEGORY_IMAGE[category];
}