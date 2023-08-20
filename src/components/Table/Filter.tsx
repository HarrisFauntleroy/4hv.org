/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Column, FilterFn, Row, Table } from "@tanstack/react-table";
import { InputHTMLAttributes, useEffect, useState } from "react";
import { InputDataTypes } from ".";
import { Debug } from "../Debug";

type FilterProps<TData> = {
  column: Column<TData>;
  table: Table<TData>;
};

export function Filter<TData extends InputDataTypes>({
  column,
  table,
}: FilterProps<TData>) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div>
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder="Min"
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder="Max"
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
      className="w-36 border shadow rounded"
    />
  );
}

type DebouncedInputProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

// A debounced input react component
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, setValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <InputGroup size="sm">
      <Input
        {...props}
        size="sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <InputRightElement cursor="pointer" onClick={() => setValue("")}>
        <CloseIcon />
      </InputRightElement>
    </InputGroup>
  );
}

type RenderSubComponentProps<TData> = {
  row: Row<TData>;
};

export const RenderSubComponent = <TData extends InputDataTypes>({
  row,
}: RenderSubComponentProps<TData>) => <Debug data={row.original} />;

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Returns items that pass the filter
  return itemRank.passed;
};
