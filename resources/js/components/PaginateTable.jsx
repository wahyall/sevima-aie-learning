import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useDebounce, For, If } from "react-haiku";

import {
  Card,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Input,
  Select,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const PaginateTable = forwardRef(({ columns, url, id, payload }, ref) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);

  const { data, isFetching, refetch } = useQuery(
    [url],
    () =>
      axios
        .post(url, { search: debouncedSearch, page, per, ...payload })
        .then((res) => res.data),
    {
      placeholderData: { data: [] },
    }
  );

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    refetch();
  }, [debouncedSearch, per, page, payload]);

  const pagination = useMemo(() => {
    let limit = data.last_page <= page + 1 ? 5 : 2;
    return Array.from({ length: data.last_page }, (_, i) => i + 1).filter(
      (i) =>
        i >= (page < 3 ? 3 : page) - limit && i <= (page < 3 ? 3 : page) + limit
    );
  }, [data.current_page]);

  return (
    <Card id={id} className="w-full h-full">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none flex justify-between gap-2 flex-wrap mb-4"
      >
        <div className="flex gap-4 items-center">
          <label htmlFor="limit" className="form-label">
            Tampilkan
          </label>
          <Select
            value={perOptions.filter((opt) => opt.value === per)}
            onChange={(ev) => setPer(ev.value)}
            id="limit"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
        </div>
        <div>
          <Input
            label="Cari"
            value={search}
            onInput={(ev) => setSearch(ev.target.value)}
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    key={header.id}
                    style={{ ...header.column.columnDef.style }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <If isTrue={!!data.data.length}>
              {table.getRowModel().rows.map((row) => (
                <tr key={`row.${row.original.uuid}`}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className={cell.column.columnDef.className}
                      key={`cell.${cell.id}.${cell.row.original.uuid}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </If>
            <If isTrue={!data.data.length}>
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Data tidak ditemukan
                </td>
              </tr>
            </If>
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex justify-content-between border-t border-blue-gray-50 p-4">
        <div className="text-gray-700 text-xs">
          Menampilkan {data.from} sampai {data.to} dari {data.total} hasil
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-2"
            onClick={prev}
            disabled={data.current_page === 1}
            onClick={() => setPage(data.current_page - 1)}
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
          </Button>
          <div className="flex items-center gap-2">
            <For
              each={pagination}
              render={(item) => (
                <IconButton onClick={() => setPage(item)}>{item}</IconButton>
              )}
            />
          </div>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-2"
            onClick={next}
            disabled={data.current_page === data.last_page}
            onClick={() => setPage(data.current_page + 1)}
          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});

export default memo(PaginateTable);
