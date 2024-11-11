import type { View } from "../types/view";

export interface PagedCollection<T> {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
  "hydra:member": T[];
  "hydra:search"?: object;
  "hydra:totalItems"?: number;
  "hydra:view": View;
}
