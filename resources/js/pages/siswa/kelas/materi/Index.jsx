import { useState } from "react";
import MainLayout from "@/pages/MainLayout";
import { Typography, Button } from "@material-tailwind/react";
import { FileUpload } from "@/components";
import { toast } from "react-toastify";

import { usePage } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Index() {
  const [file, setFile] = useState([]);
  const { kode, materi } = usePage().props;
  const { data = {} } = useQuery({
    queryKey: ["kelas", kode, "materi", materi],
    queryFn: () =>
      axios
        .get(`/api/siswa/kelas/${kode}/materi/${materi}`)
        .then((res) => res.data),
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: kumpulkanTugas, isLoading } = useMutation(
    (data) =>
      axios
        .post(`/api/siswa/kelas/${kode}/materi/${materi}/tugas`, data)
        .then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  function handleKumpulkanTugas(ev) {
    ev.preventDefault();

    if (file.length === 0) {
      toast.error("File tidak boleh kosong");
      return;
    }

    const formData = new FormData(ev.target);
    formData.append("file", file[0].file);
    kumpulkanTugas(formData);
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <Typography variant="h1" className="mt-4 mb-8">
          {data.judul}
        </Typography>
        {!!data.file && (
          <a href={data.file} target="_blank">
            <Button variant="outlined" size="sm">
              Unduh File
            </Button>
          </a>
        )}
      </div>
      <article
        dangerouslySetInnerHTML={{ __html: data.konten }}
        className="whitespace-pre-line"
      ></article>

      <hr className="my-8" />
      <form onSubmit={handleKumpulkanTugas}>
        <h6 className="text-sm mb-2">Pengumpulan Tugas</h6>
        <FileUpload
          files={file}
          onupdatefiles={setFile}
          allowMultiple={false}
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
        <Button type="submit" disabled={isLoading}>
          Kumpulkan
        </Button>
      </form>
    </section>
  );
}

Index.layout = (page) => <MainLayout children={page} {...page.props} />;
