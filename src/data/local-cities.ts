import { LOCAL_CITIES_PART1 } from "./local-cities-part1";
import { LOCAL_CITIES_PART2 } from "./local-cities-part2";
import type { LocalCityData } from "./local-cities-types";

export * from "./local-cities-types";

export const LOCAL_CITIES: LocalCityData[] = [
  ...LOCAL_CITIES_PART1,
  ...LOCAL_CITIES_PART2,
];

const BY_SLUG = new Map<string, LocalCityData>(
  LOCAL_CITIES.map((city) => [city.slug, city])
);

export function getLocalCityBySlug(slug: string): LocalCityData | undefined {
  return BY_SLUG.get(slug);
}

export function getAllLocalCitySlugs(): string[] {
  return LOCAL_CITIES.map((city) => city.slug);
}
