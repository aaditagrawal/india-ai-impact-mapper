import { clsx, type ClassValue } from "clsx";

type VariantTable = Record<string, Record<string, string>>;
type VariantKey<Key> = Key extends "true" | "false" ? boolean : Key;
type VariantSelection<Table extends VariantTable> = {
  [Name in keyof Table]?: VariantKey<keyof Table[Name]> | null;
};
type VariantInput<Table extends VariantTable> = VariantSelection<Table> & {
  class?: ClassValue;
  className?: ClassValue;
};

export type VariantProps<Selector extends (...args: never[]) => string> = Omit<
  NonNullable<Parameters<Selector>[0]>,
  "class" | "className"
>;

// Only the finite class lookup tables and defaults used by our controls are supported.
export function defineVariants<Table extends VariantTable>(
  base: string,
  config: { variants: Table; defaultVariants: VariantSelection<Table> },
) {
  return (props?: VariantInput<Table>): string => {
    let result = base;
    for (const name in config.variants) {
      const value = props?.[name];
      // An explicit null suppresses this variant, including its default.
      if (value === null) continue;
      const key = value === undefined || value === "" ? config.defaultVariants[name] : value;
      if (key === null || key === undefined) continue;
      const selected = config.variants[name][String(key)];
      if (selected) result += (result ? " " : "") + selected;
    }
    return clsx(result, props?.class, props?.className);
  };
}
