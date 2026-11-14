import { createContext, useContext } from "react";

/** What a Field tells the control inside it: its id, what describes it, and whether it is invalid. */
export type FieldControl = {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
};

export const FieldContext = createContext<FieldControl | null>(null);

/** The control's ARIA wiring when it sits inside a Field, or nothing when it stands alone. */
export function useFieldControl(): FieldControl | null {
  return useContext(FieldContext);
}
