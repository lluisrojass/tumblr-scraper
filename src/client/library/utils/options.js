import { 
  type OptionT,
} from '@ts/containers/Type-Options/types.flow.js';

export const makeOption = (label: string, type: string, value: boolean): 
    OptionT => ({ label, type, value });
