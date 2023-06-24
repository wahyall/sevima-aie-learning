import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

export function useUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => axios.get("/user").then((res) => res.data),
    staleTime: Infinity,
  });
}
