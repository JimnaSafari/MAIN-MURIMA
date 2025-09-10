export type TownInfo = {
  name: string;
  image: string; // Representative image URL for the town
};

export type CountyLocations = Record<string, TownInfo[]>;

// Counties and towns with curated Unsplash images
export const locationData: CountyLocations = {
  "Nairobi": [
    { name: "Nairobi CBD", image: "https://images.unsplash.com/photo-1562088287-bde35a1ea917?w=1200&auto=format&fit=crop" },
    { name: "Westlands", image: "https://images.unsplash.com/photo-1533514114760-4389f572ae99?w=1200&auto=format&fit=crop" },
    { name: "Kilimani", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" },
    { name: "Koinange Street", image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop" },
    { name: "Lang'ata", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop" },
    { name: "Karen", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop" },
    { name: "Parklands", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop" },
    { name: "Lavington", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Kileleshwa", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&auto=format&fit=crop" },
    { name: "Hurligham", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "River Road", image: "https://images.unsplash.com/photo-1582582621959-48d5024f00c5?w=1200&auto=format&fit=crop" },
    { name: "Tom Mboya Street", image: "https://images.unsplash.com/photo-1544986581-efac024faf62?w=1200&auto=format&fit=crop" }
  ],
  "Embu": [
    { name: "Embu Town", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop" },
    { name: "Runyenjes", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop" },
    { name: "Siakago", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Kiritiri", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" },
    { name: "Manyatta", image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop" }
  ],
  "Nyeri": [
    { name: "Nyeri Town", image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=1200&auto=format&fit=crop" },
    { name: "Othaya", image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&auto=format&fit=crop" },
    { name: "Karatina", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Naro Moru", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" },
    { name: "Mathira", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop" }
  ],
  "Kirinyaga": [
    { name: "Kerugoya", image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200&auto=format&fit=crop" },
    { name: "Kutus", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop" },
    { name: "Sagana", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Baricho", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" }
  ],
  "Murang'a": [
    { name: "Murang'a Town", image: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?w=1200&auto=format&fit=crop" },
    { name: "Maragua", image: "https://images.unsplash.com/photo-1455906876003-298dd8c44ec8?w=1200&auto=format&fit=crop" },
    { name: "Kangema", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Kandara", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" },
    { name: "Gatanga", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop" }
  ],
  "Meru": [
    { name: "Meru Town", image: "https://images.unsplash.com/photo-1582582621959-48d5024f00c5?w=1200&auto=format&fit=crop" },
    { name: "Nkubu", image: "https://images.unsplash.com/photo-1544986581-efac024faf62?w=1200&auto=format&fit=crop" },
    { name: "Maua", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop" },
    { name: "Chuka", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Imenti", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" }
  ],
  "Laikipia": [
    { name: "Nanyuki", image: "https://images.unsplash.com/photo-1529165981561-8c5ae80d40a5?w=1200&auto=format&fit=crop" },
    { name: "Nyahururu", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop" },
    { name: "Rumuruti", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Dol Dol", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" }
  ],
  "Chuka": [
    { name: "Chuka Town", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Karingani", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" },
    { name: "Magumoni", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop" }
  ],
  "Tharaka-Nithi": [
    { name: "Chuka", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop" },
    { name: "Maara", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format&fit=crop" },
    { name: "Muthambi", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop" },
    { name: "Nkondi", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop" }
  ]
};

export const allCounties = Object.keys(locationData);

export function townsForCounty(county?: string): TownInfo[] {
  if (!county) return Object.values(locationData).flat();
  return locationData[county] ?? [];
}
