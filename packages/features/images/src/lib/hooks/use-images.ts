import { useSupabase } from "@kit/supabase";
import { useQuery } from "@tanstack/react-query";
import type { ImageMetadata, SyncedImage } from "../../types";

export function useImages() {
  const client = useSupabase();

  return useQuery<SyncedImage[]>({
    queryKey: ["images"],
    queryFn: async () => {
      const { data, error } = await client
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map((image) => ({
        ...image,
        metadata: image.metadata as ImageMetadata,
      }));
    },
  });
}
