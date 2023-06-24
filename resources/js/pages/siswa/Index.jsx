import { useMemo, useState, useRef } from "react";

import { PaginateTable } from "@/components";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import MainLayout from "@/pages/MainLayout";
import Form from "./Form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "@inertiajs/react";
const columnHelper = createColumnHelper();

export default function Index() {
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
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
    columnHelper.accessor("kode", {
      header: "Kode",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("nama", {
      header: "Nama",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("id", {
      header: "Aksi",
      style: {
        width: "200px",
      },
      cell: (cell) => (
        <div>
          <Link href={`/siswa/kelas/${cell.row.original.kode}`}>
            <Button size="sm" className="me-2">
              Lihat
            </Button>
          </Link>
          <Button
            size="sm"
            color="red"
            onClick={() => {
              setDialogKeluar(true);
              setSelected(cell.row.original);
            }}
          >
            Keluar
          </Button>
        </div>
      ),
    }),
  ]);

  return (
    <section className="my-10">
      {openForm && <Form table={table} close={() => setOpenForm(false)} />}
      <Card>
        {!openForm && (
          <CardHeader className="p-4 flex justify-between">
            <h1 className="text-2xl font-semibold mb-0 text-black">
              Kelas Saya
            </h1>
            <Button onClick={() => setOpenForm(true)}>Gabung Kelas</Button>
          </CardHeader>
        )}
        <CardBody>
          <PaginateTable
            url="/api/siswa/kelas"
            columns={columns}
            id="table-kelas"
            ref={table}
          />
        </CardBody>
      </Card>

      <Dialog open={dialogKeluar}>
        <DialogHeader>Apakah Anda yakin ingin keluar Kelas?</DialogHeader>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setDialogKeluar(false)}
            className="mr-1"
          >
            <span>Batal</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => keluarKelas(selected.kode)}
            disabled={isLoading}
          >
            <span>Ya, Keluar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </section>
  );
}

Index.layout = (page) => <MainLayout children={page} {...page.props} />;
