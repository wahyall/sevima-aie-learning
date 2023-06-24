import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => axios.get("/api/user").then((res) => res.data),
    staleTime: Infinity,
  });
}
