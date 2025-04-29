
import { useQuery } from "@tanstack/react-query";
import { getBatches } from "@/services/api";
import { Batch } from "@/types";

export const useBatches = () => {
  return useQuery<Batch[]>({
    queryKey: ['batches'],
    queryFn: getBatches,
    // Ensure we always have an array, even on error
    select: (data) => Array.isArray(data) ? data : [],
  });
};
