import { useMemo, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import { PaginateTable } from "@/components";
import MainLayout from "../../MainLayout";
import Form from "./Form";
import { toast } from "react-toastify";
import { Link, usePage } from "@inertiajs/react";

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { createColumnHelper } from "@tanstack/react-table";
const columnHelper = createColumnHelper();

export default function Index() {
  const { kode } = usePage().props;
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const table = useRef(null);

  function handleCloseForm() {
    setOpenForm(false);
    setSelected(null);
  }

  const { mutate: hapusMateri, isLoading } = useMutation(
    (kelas) => axios.delete(`/api/materi/${kelas}`).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        table.current.refetch();
        setDialogHapus(false);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  const [dialogHapus, setDialogHapus] = useState(false);
  const columns = useMemo(() => [
    columnHelper.accessor("nomor", {
      header: "#",
      style: {
        width: "25px",
      },
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("judul", {
      header: "Kode",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("kelas.nama", {
      header: "Kelas",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("tipe", {
      header: "tipe",
      cell: (cell) => cell.getValue(),
    }),
    columnHelper.accessor("id", {
      header: "Aksi",
      style: {
        width: "200px",
      },
      cell: (cell) => (
        <div className="flex gap-2">
          {cell.row.original.tipe === "tugas" && (
            <Link href={`/kelas/${kode}/materi/${cell.getValue()}/tugas`}>
              <Button variant="outlined" size="sm">
                Tugas
              </Button>
            </Link>
          )}
          <Button
            size="sm"
            color="amber"
            onClick={() => {
              setOpenForm(true);
              setSelected(cell.row.original);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            color="red"
            onClick={() => {
              setDialogHapus(true);
              setSelected(cell.row.original);
            }}
          >
            Hapus
          </Button>
        </div>
      ),
    }),
  ]);

  return (
    <section className="my-10">
      {openForm && (
        <Form
          table={table}
          selected={selected}
          close={handleCloseForm}
          kode={kode}
        />
      )}
      <Card>
        {!openForm && (
          <CardHeader className="p-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold mb-0 text-black">
              Dashboard Materi ({kode})
            </h1>
            <div>
              <Link href="/">
                <Button variant="outlined" className="me-2">
                  Kembali
                </Button>
              </Link>
              <Button onClick={() => setOpenForm(true)}>Buat Materi</Button>
            </div>
          </CardHeader>
        )}
        <CardBody>
          <PaginateTable
            url={`/api/kelas/${kode}/materi/paginate`}
            columns={columns}
            id="table-materi"
            ref={table}
          />
        </CardBody>
      </Card>

      <Dialog open={dialogHapus}>
        <DialogHeader>Apakah Anda yakin ingin menghapus Materi?</DialogHeader>
        <DialogBody divider>
          Data yang dihapus tidak dapat dikembalikan.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setDialogHapus(false)}
            className="mr-1"
          >
            <span>Batal</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => hapusMateri(selected.id)}
            disabled={isLoading}
          >
            <span>Ya, Hapus</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </section>
  );
}

Index.layout = (page) => <MainLayout children={page} {...page.props} />;
