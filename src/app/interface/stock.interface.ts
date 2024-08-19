import { Accessory } from './accessory.interface';

export interface StockItem {
  id?: string;
  regNo: string;
  make: string;
  model: string;
  modelYear: number;
  kms: number;
  color: string;
  vin: string;
  retailPrice: number;
  costPrice: number;
  accessories?: Accessory[];
  images: string[];
  dtCreated?: Date;
  dtUpdated?: Date;
}
