import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, router } from "@inertiajs/react";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { mutate, isLoading } = useMutation(
    (data) => axios.post("/login", data).then((res) => res.data),
    {
      onSuccess: (data) => {
        if (data.user.role === "guru") router.visit("/");
        else router.visit("/siswa");
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    }
  );

  return (
    <section className="w-100 h-screen bg-blue-400 flex justify-center items-center">
      <Card className="max-w-sm">
        <CardBody>
          <Typography variant="h4" color="blue-gray">
            Masuk
          </Typography>
          <form
            className="mt-8 mb-2 w-80 max-w-screen-lg"
            onSubmit={handleSubmit(mutate)}
          >
            <div className="mb-4 flex flex-col gap-6">
              <Input
                size="lg"
                label="Email"
                {...register("email", { required: true })}
              />
              <Input
                type="password"
                size="lg"
                label="Password"
                {...register("password", { required: true })}
              />
            </div>
            <Button
              type="submit"
              className="mt-6"
              fullWidth
              disabled={isLoading}
            >
              Masuk
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              Belum memiliki akun?{" "}
              <Link
                href="register"
                className="font-medium text-blue-500 transition-colors hover:text-blue-700"
              >
                Daftar
              </Link>
            </Typography>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
