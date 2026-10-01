import { createContext, useContext } from 'react';

/** Lets a control inside <Field> pick up its id, description ids and invalid state. */
export interface FieldContextValue { id: string; describedBy?: string; invalid: boolean; disabled: boolean; required: boolean }
export const FieldContext = createContext<FieldContextValue | null>(null);
export const useFieldContext = () => useContext(FieldContext);
