import { useQuery } from "@tanstack/react-query";

export function useKelas() {
  return useQuery({
    queryKey: ["kelas"],
    queryFn: () => axios.get("/api/kelas").then((res) => res.data.kelas),
    staleTime: 0,
  });
}
