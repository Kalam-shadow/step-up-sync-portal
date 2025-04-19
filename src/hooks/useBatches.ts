
import { useQuery } from "@tanstack/react-query";
import { getBatches } from "@/services/api";

export const useBatches = () => {
  return useQuery({
    queryKey: ['batches'],
    queryFn: getBatches,
    // Ensure we always have an array, even on error
    select: (data) => Array.isArray(data) ? data : [],
  });
};
