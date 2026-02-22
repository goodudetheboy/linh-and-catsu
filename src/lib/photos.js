import { supabase, isSupabaseReady } from "./supabase";

export async function uploadPhoto(catName, file) {
  if (!isSupabaseReady) throw new Error("Supabase not configured yet.");
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage
    .from("cat-photos")
    .upload(`${catName}/${fileName}`, file, { upsert: false });
  if (error) throw error;
  return data;
}

export async function getPhotos(catName) {
  if (!isSupabaseReady) return [];
  const { data, error } = await supabase.storage
    .from("cat-photos")
    .list(catName, { sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;
  return data ?? [];
}

export function getPhotoUrl(catName, fileName) {
  if (!isSupabaseReady) return "";
  const { data } = supabase.storage
    .from("cat-photos")
    .getPublicUrl(`${catName}/${fileName}`);
  return data.publicUrl;
}
