import type { Tables } from "@kit/supabase";

export type ImageMetadata = {
  width: number;
  height: number;
  creationTime: number;
  modificationTime: number;
  filename: string;
  uniqueId: string;
};

export type SyncedImage = Tables<"images"> & {
  metadata: ImageMetadata;
};
