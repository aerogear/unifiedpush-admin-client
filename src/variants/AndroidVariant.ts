import { Variant } from './Variant';

export interface AndroidVariant extends Variant {
  googleKey: string;
  projectNumber: string;
  type: 'android';
}
