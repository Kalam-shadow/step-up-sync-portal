
import { useQuery } from "@tanstack/react-query";
import { getBatches } from "@/services/api";

export const useBatches = () => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: getBatches,
  });
};
