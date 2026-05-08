import { Client } from "@googlemaps/google-maps-services-js";
import { z } from "zod";

const POISchema = z.object({
  placeId:    z.string(),
  name:       z.string(),
  rating:     z.number().min(0).max(5),
  priceLevel: z.number().int().min(0).max(4).nullable(),
  location:   z.object({ lat: z.number(), lng: z.number() }),
  types:      z.array(z.string()),
  openNow:    z.boolean().nullable(),
  editorialSummary: z.string().optional(),
});
export type POI = z.infer<typeof POISchema>;

export async function photoToPOI(base64Image: string): Promise<string[]> {
  // Vision API → landmark detection → place names
  const visionRes = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [{ type: "LANDMARK_DETECTION", maxResults: 5 }],
        }],
      }),
    }
  );
  const data = await visionRes.json();
  return data.responses[0]?.landmarkAnnotations?.map(
    (l: { description: string }) => l.description
  ) ?? [];
}

export async function fetchNearbyPOIs(
  lat: number, lng: number, radius: number, types: string[]
): Promise<POI[]> {
  const client = new Client({});
  const res = await client.placesNearby({
    params: { location: { lat, lng }, radius, type: types[0],
               key: process.env.GOOGLE_MAPS_API_KEY! },
  });
  return res.data.results.map((r) =>
    POISchema.parse({
      placeId:    r.place_id,
      name:       r.name,
      rating:     r.rating ?? 0,
      priceLevel: r.price_level ?? null,
      location:   r.geometry!.location,
      types:      r.types ?? [],
      openNow:    r.opening_hours?.open_now ?? null,
    })
  );
}
