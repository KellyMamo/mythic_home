import { House, GlobalFilters } from "../types";
import { supabase } from "./supabaseClient";

const TABLE = "houses";

export const db = {
  getHouses: async (): Promise<House[]> => {
    const { data, error } = await supabase

      .from(TABLE)
      .select("data")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Supabase getHouses error:", error);
      return [];
    }

    return (data ?? []).map((r: any) => r.data as House);
  },

  saveHouse: async (house: House, _originalId?: string): Promise<boolean> => {
    const payload = {
      id: house.id,
      slug: house.slug,
      data: { ...house, updatedAt: Date.now() },
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Supabase saveHouse error:", error);
      return false;
    }
    return true;
  },

  createHouse: async (): Promise<House | null> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newHouse: House = {
      id,
      slug: `new-house-${id}`,
      name: "New Architectural Design",
      description: "Start typing your description here...",
      style: "Modern",
      beds: 3,
      baths: 2,
      garageCars: 2,
      areaValue: 2200,
      areaUnit: "sq ft",
      price: 1150,
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      galleryUrls: [],
      floorplanUrls: [],
      downloadFiles: [],
      published: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      floors: 1,
      propertyType: "Single Family",
    };

    const ok = await db.saveHouse(newHouse);
    return ok ? newHouse : null;
  },

  deleteHouse: async (id: string): Promise<void> => {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) console.error("Supabase deleteHouse error:", error);
  },

  // TEMP: filters disabled for now
  getGlobalFilters: async (): Promise<GlobalFilters> => ({
    allowedStyles: [],
    allowedPropertyTypes: [],
    allowedBeds: [],
    allowedBaths: [],
    allowedFloors: [],
  }),

  saveGlobalFilters: async (): Promise<boolean> => true,

  getHouseById: async (id: string) => (await db.getHouses()).find((h) => h.id === id),
  getHouseBySlug: async (slug: string) => (await db.getHouses()).find((h) => h.slug === slug),
};