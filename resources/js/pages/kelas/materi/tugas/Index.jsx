import { useMemo, useState, useRef } from "react";

import { PaginateTable } from "@/components";
import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";
import MainLayout from "@/pages/MainLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createColumnHelper } from "@tanstack/react-table";
import { Link, usePage } from "@inertiajs/react";
const columnHelper = createColumnHelper();

export default function Index() {
  const { kode, materi } = usePage().props;
  const table = useRef(null);

  const columns = useMemo(() => [
    columnHelper.accessor("nomor", {
      header: "#",
      style: {
        width: "25px",
      },
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("user.name", {
      header: "Siswa",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("file", {
      header: "File Tugas",
      cell: (cell) => (
        <a href={`/${cell.getValue()}`} target="_blank">
          <Button variant="outlined" size="sm">
            Unduh
          </Button>
        </a>
      ),
    }),
    columnHelper.accessor("waktu_pengumpulan", {
      header: "Waktu Pengumpulan",
      cell: (cell) => cell.getValue(),
    }),
  ]);

  return (
    <section className="my-10">
      <Card>
        <CardHeader className="p-4 flex justify-between">
          <h1 className="text-2xl font-semibold mb-0 text-black">
            Pengumpulan Tugas
          </h1>
          <Link href={`/kelas/${kode}/materi`}>
            <Button variant="outlined">Kembali</Button>
          </Link>
        </CardHeader>
        <CardBody>
          <PaginateTable
            url={`/api/kelas/${kode}/materi/${materi}/tugas`}
            columns={columns}
            id="table-kelas"
            ref={table}
          />
        </CardBody>
      </Card>
    </section>
  );
}

Index.layout = (page) => <MainLayout children={page} {...page.props} />;
