import {
  Table as ChakraTable,
  HStack,
  Stack,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Fragment,
  ReactElement,
  useState,
  type PropsWithChildren,
} from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { InferQueryOutput } from "../../utils/trpc";
import { Show } from "../Show";
import TableHeader from "../Table/Header";
import { Pagination } from "../Table/Pagination";
import { DebouncedInput, fuzzyFilter } from "./Filter";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

/** Extend all possible input types */
export type InputDataTypes = InferQueryOutput<"forum.all">;

export type TableProps<TData> = {
  /** Table ID allows for persistent state on some table settings */
  id: string;
  columns: ColumnDef<TData>[];
  data: TData[];
  pageSize?: number;
  paginationEnabled?: boolean;
  filterEnabled?: boolean;
  renderSubComponent?: (props: { row: Row<TData> }) => ReactElement;
  getRowCanExpand?: (row: Row<TData>) => boolean;
} & PropsWithChildren;

export const Table = <TData extends InputDataTypes>({
  children,
  columns,
  data,
  pageSize,
  renderSubComponent,
  getRowCanExpand,
  filterEnabled,
  paginationEnabled,
  id,
}: TableProps<TData>) => {
  /** Global filter - search */
  const [globalFilter, setGlobalFilter] = useState("");

  /** Column filter - search */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  /** Column sorting */
  const [sorting, setSorting] = useLocalStorage<SortingState>(
    `table-sort-${id}`,
    []
  );

  /** Pagination state */
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    // Default row count
    pageSize: pageSize || 20,
  });

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    getRowCanExpand,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    /** Debug */
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  return (
    <Stack gap={2}>
      <HStack>{children}</HStack>
      <Show when={!!filterEnabled}>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Search all columns..."
        />
      </Show>
      <TableContainer>
        <ChakraTable variant="simple" size="sm">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(TableHeader)}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <Tr>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
                {renderSubComponent && row.getIsExpanded() && (
                  <Tr>
                    {/* 2nd row is a custom 1 cell row */}
                    <Td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row })}
                    </Td>
                  </Tr>
                )}
              </Fragment>
            ))}
          </Tbody>
          <Tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <Tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Tfoot>
        </ChakraTable>
        {paginationEnabled && <Pagination table={table} id={id} />}
      </TableContainer>
    </Stack>
  );
};
