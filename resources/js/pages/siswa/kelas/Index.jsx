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
  const { kode } = usePage().props;
  const table = useRef(null);

  const { mutate: keluarKelas, isLoading } = useMutation(
    (kelas) =>
      axios.get(`/api/siswa/kelas/${kelas}/leave`).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        table.current.refetch();
        setDialogKeluar(false);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const [dialogKeluar, setDialogKeluar] = useState(false);
  const columns = useMemo(() => [
    columnHelper.accessor("nomor", {
      header: "#",
      style: {
        width: "25px",
      },
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("judul", {
      header: "Judul",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("tipe", {
      header: "Tipe",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("file", {
      header: "File",
      cell: (cell) =>
        cell.getValue() ? (
          <a href={`/${cell.getValue()}`} target="_blank">
            <Button variant="outlined" size="sm">
              Unduh
            </Button>
          </a>
        ) : (
          "Tidak ada"
        ),
    }),
    columnHelper.accessor("id", {
      header: "Aksi",
      style: {
        width: "200px",
      },
      cell: (cell) => (
        <div>
          <Link href={`/siswa/kelas/${kode}/materi/${cell.getValue()}`}>
            <Button size="sm" className="me-2">
              Lihat
            </Button>
          </Link>
        </div>
      ),
    }),
  ]);

  const { data: kelas = {} } = useQuery({
    queryKey: ["kelas", kode],
    queryFn: () =>
      axios.get(`/api/kelas/${kode}`).then((res) => res.data.kelas),
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return (
    <section className="my-10">
      <Card>
        <CardHeader className="p-4 flex justify-between">
          <h1 className="text-2xl font-semibold mb-0 text-black">
            Materi Kelas: {kelas?.nama}
          </h1>
          <Link href="/siswa">
            <Button variant="outlined">Kembali</Button>
          </Link>
        </CardHeader>
        <CardBody>
          <PaginateTable
            url={`/api/siswa/kelas/${kode}/materi`}
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
