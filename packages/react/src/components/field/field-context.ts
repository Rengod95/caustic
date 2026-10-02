import { createContext, useContext } from 'react';

/**
 * Lets a control inside <Field> pick up its id, description ids and invalid state.
 * In group mode there is no single control: `id` is undefined and controls only read invalid, disabled and required.
 */
export interface FieldContextValue { id?: string | undefined; describedBy?: string | undefined; invalid: boolean; disabled: boolean; required: boolean }
export const FieldContext = createContext<FieldContextValue | null>(null);
export const useFieldContext = () => useContext(FieldContext);
