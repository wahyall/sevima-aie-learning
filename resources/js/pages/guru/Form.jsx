import { memo, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Button,
  Input,
} from "@material-tailwind/react";

export default memo(function Form({ table, close, selected }) {
  const { register, handleSubmit } = useForm({
    values: selected,
  });

  const url = useMemo(() => {
    if (selected?.id) return `/api/kelas/${selected?.id}`;
    else return "/api/kelas";
  }, [selected]);
  const { mutate, isLoading } = useMutation(
    (data) => axios.post(url, data).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        table.current.refetch();
        close();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit(mutate)}>
        <CardHeader className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-0 text-black">
            {selected?.id ? "Edit" : "Buat"} Kelas
          </h1>
          <div>
            <Button
              variant="outlined"
              type="button"
              className="ms-auto me-4"
              onClick={close}
            >
              Batal
            </Button>
            <Button type="submit" className="ms-auto" disabled={isLoading}>
              Simpan
            </Button>
          </div>
        </CardHeader>
        <CardBody className="py-10">
          <div className="grid grid-cols-2 gap-8">
            <Input label="Kode" {...register("kode")} disabled />
            <Input
              label="Nama Kelas"
              {...register("nama", { required: true })}
            />
          </div>
        </CardBody>
      </form>
    </Card>
  );
});
