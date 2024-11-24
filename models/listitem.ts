import type { Category } from "./category";
import type { IAnyObject } from "~/types";
import type { Item } from "./item";


export interface ListItem extends Item, IAnyObject {
  category?: Category | string;
  description?: string;
  list?: any;
  name?: string;
  status?: number;
  url?: string;
}


export const DURATION_TYPES = {
  0: "minutes",
  1: "heure(s)",
  2: "jour(s)",
  3: "semaine(s)",
  4: "mois",
  5: "année(s)"
}

export const PRIORITIES = {
  0: "Aucune",
  1: "Basse",
  2: "Normale",
  3: "Haute",
  4: "Absolue"
}

export const QUANTITY_UNITS = {
  "0": "unité",
  "1": "gramme",
  "2": "kilo-gramme",
  "3": "centilitre",
  "4": "litre",
  "5": "boite",
  "6": "bouteille",
  "7": "minimètre",
  "8": "centimètre",
  "9": "mètre"
}