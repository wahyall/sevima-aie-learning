import { memo, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Radio,
} from "@material-tailwind/react";
import { FileUpload } from "@/components";

export default memo(function Form({ table, close, selected }) {
  const [file, setFile] = useState([]);
  const { register, control, watch, setValue } = useForm({
    values: selected,
  });

  const url = useMemo(() => {
    if (selected?.id) return `/api/materi/${selected?.id}`;
    else return "/api/materi";
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

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.target);
    if (file.length) data.append("file", file[0].file);
    mutate(data);
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit} id="form-materi">
        <CardHeader className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold mb-0 text-black">
            {selected?.id ? "Edit" : "Buat"} Materi
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
            <div>
              <div className="mb-4">
                <Input
                  label="Judul Materi"
                  className="mb-6"
                  {...register("judul", { required: true })}
                />
              </div>
              <FileUpload
                files={file}
                onupdatefiles={setFile}
                allowMultiple={false}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              />
              <div className="mb-6">
                <label className="text-sm text-gray-600">Tipe</label>
                <div className="flex gap-10">
                  <Radio
                    id="materi"
                    name="tipe"
                    label="Materi"
                    value="materi"
                    {...register("tipe", { required: true })}
                  />
                  <Radio
                    id="tugas"
                    name="tipe"
                    label="Tugas"
                    value="tugas"
                    {...register("tipe", { required: true })}
                  />
                </div>
              </div>
            </div>
            <div>
              <Textarea
                label="Isi"
                rows={10}
                {...register("konten", { required: true })}
              />
            </div>
          </div>
        </CardBody>
      </form>
    </Card>
  );
});
