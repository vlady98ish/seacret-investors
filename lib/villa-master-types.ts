/** One row from Excel MASTER (villa_system spreadsheet). */
export type VillaMasterRecord = {
  plot: string;
  villaId: string;
  type: string;
  floors: number | null;
  builtM2: number | null;
  groundFloor: number | null;
  firstFloor: number | null;
  secondFloor: number | null;
  plotSize: number | null;
  gardenM2: number | null;
  balconyM2: number | null;
  roofTerraceM2: number | null;
  poolM2: number | null;
  parkingSpaces: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  livingM2: number | null;
  bedroomGroundFloor: string | null;
  livingRoomFirstFloor: string | null;
  bedroomFirstFloor: string | null;
  bedroomSecondFloor: string | null;
  status: string;
  priceEur: number | null;
  pricePerBuiltM2: number | null;
};

export type VillaMasterById = Record<string, VillaMasterRecord>;
