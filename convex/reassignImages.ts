import { mutation } from "./_generated/server";

const mapping: Record<string, string> = {
  "Green Crop Booster": "Green_Crop_Booster.jpg",
  "CBD Crop Booster": "CBD_Crop_Booster.jpg",
  "Duduthrin 1.75 SEC": "Duduthrin_1.75_SEC.png",
  "Halothrin": "Halothrin.jpg",
  "Alphaguard": "Alphaguard.jpg",
  "Poultry Microbes": "Poultry_Microbes.png",
  "Collards 10g Royal Advanta": "Collards_10g_Royal_Advanta.webp",
  "Collards 25g Royal Sukumawiki": "Collards_25g_Royal_Sukumawiki.webp",
  "Collards 50g Advanta": "Collards_50g_Advanta.jpg",
  "Spinach Simlaw": "Spinach_Simlaw.jpg",
  "Simlaw Dhania": "Simlaw_Dhania.jpg",
  "Simlaw Saga": "Simlaw_Saga.webp",
  "Chick and Duckling Crumbs": "Chick_and_Duckling_Crumbs.jpg",
  "Fast Grow Finisher Pellets (UNGA)": "Fast_Grow_Finisher_Pellets_UNGA.webp",
  "Growers Mash (UNGA)": "Growers_Mash_UNGA.jpg",
  "Growers Mash (UNGA)@ 80/= per kg": "Growers_Mash_UNGA@_80_=_per_kg.png",
  "Kale 1000 Headed Royal": "Kale_1000_Headed_Royal.jpg",
  "Microp Planting": "Microp_Planting.webp",
  "DAP Falcon  (@160/= per Kg)": "DAP_Falcon__@160_=_per_Kg.jpg",
  "DAP Falcon": "DAP_Falcon.jpg",
  "Gradometer": "Gradometer.jpg",
  "Confidor WG 70": "Confidor_WG_70.jpg",
  "Bamako 1097": "Bamako_1097.jpg",
  "Diazole Agrichem": "Diazole_Agrichem.jpg",
  "Bedlam 200 SL": "Bedlam_200_SL.webp",
  "CBDP Crop Booster": "CBDP_Crop_Booster.jpg",
  "Easy Grow Starter Crumps": "Easy_Grow_Starter_Crumps.jpg",
  "Easy Grow Vegetative": "Easy_Grow_Vegetative.png",
  "Easy Grow F/F": "Easy_Grow_F_F.webp",
  "Finisher Pellets UNGA": "Finisher_Pellets_UNGA.webp",
  "Kienyeji Mash Royal": "Kienyeji_Mash_Royal.jpeg",
  "S-Dime": "S-Dime.jpg",
  "Ultramix Maziwa Block": "Ultramix_Maziwa_Block.jpg",
  "Ultramix Maziwa": "Ultramix_Maziwa.png",
  "Cattlephos Bricks": "Cattlephos_Bricks.jpg",
  "Maclik Bricks( Mineral Brick 2kg Cooper)": "Maclik_Bricks_Mineral_Brick_2kg_Cooper.jpg",
  "Managu Continental": "Managu_Continental.jpg",
  "Managu Giant Simlaw": "Managu_Giant_Simlaw.jpg",
  "Chick Mash": "Chick_Mash.jpg",
  "Yara CAN Extran Fertilizer (100/= per kg)": "Yara_CAN_Extran_Fertilizer_100_=_per_kg.jpg",
  "Yara CAN Extran Fertilizer (90/= per kg)": "Yara_CAN_Extran_Fertilizer_90_=_per_kg.png",
  "Kienyeji Mash (50kg at 70/= per kg)": "Kienyeji_Mash_50kg_at_70_=_per_kg.png",
  "Chick and Duckling Mash (Fugo) -UNGA (@100 per kg)": "Chick_and_Duckling_Mash_Fugo_-UNGA_@100_per_kg.png",
  "Broiler Starter Crumbs (Faida)": "Broiler_Starter_Crumbs_Faida.jpg",
  "Chick and Duckling Mash - (Fugo) UNGA": "Chick_and_Duckling_Mash_-_Fugo_UNGA.jpg",
  "EA Collards Sukuma Wiki": "EA_Collards_Sukuma_Wiki.jpg",
  "Simlaw Managu": "Simlaw_Managu.jpg",
  "Chick and Duckling Crumbs (@ 120/= per kg)": "Chick_and_Duckling_Crumbs_@_120_=_per_kg.webp",
  "Growers Mash (UNGA)  (50kg at 100/= per kg)": "Growers_Mash_UNGA__50kg_at_100_=_per_kg.jpg",
  "Growers Mash (UNGA)  (10kg at 100/= per kg)": "Growers_Mash_UNGA__10kg_at_100_=_per_kg.jpg",
  "Finisher Pellets UNGA  (100/= per kg)": "Finisher_Pellets_UNGA__100_=_per_kg.png",
  "Aminika Western Seed WH 403": "Aminika_Western_Seed_WH_403.webp",
  "Tsavo Seeds Hybrid WE": "Tsavo_Seeds_Hybrid_WE.jpg",
  "Duma 43 Seed": "Duma_43_Seed.jpg",
  "WSL Tunza Bag": "WSL_Tunza_Bag.jpg",
  "Trimoxol Vet": "Trimoxol_Vet.jpg",
  "Gumboro 50 Doses (Life Techonology)": "Gumboro_50_Doses_Life_Techonology.webp",
  "Duodip 55% EC": "Duodip_55pct_EC.png",
  "Sypertix": "Sypertix.png",
  "Kaolin Laibuta": "Kaolin_Laibuta.png",
  "Ex Kupe": "Ex_Kupe.png",
  "Levafas Extra": "Levafas_Extra.webp",
  "Dabendazole 2.5% Dawa": "Dabendazole_2.5pct_Dawa.png",
  "Eye Wound Powder Metrocycline": "Eye_Wound_Powder_Metrocycline.jpg",
  "Cetrino Antiseptic Cream": "Cetrino_Antiseptic_Cream.jpg",
  "Wormitrex": "Wormitrex.jpg",
  "Sevin Dudu Dust": "Sevin_Dudu_Dust.png",
  "Trevin Dudu Dust": "Trevin_Dudu_Dust.jpg",
  "Capo-Vit Liquid": "Capo-Vit_Liquid.png",
  "WSL Chlorine Powder": "WSL_Chlorine_Powder.png",
  "Drinkers Pharmplan": "Drinkers_Pharmplan.jpg",
  "Feeder Pharmplan": "Feeder_Pharmplan.jpg",
  "Pigeon Hole Feeder": "Pigeon_Hole_Feeder.jpg",
  "DK 8031": "DK_8031.jpg",
  "DK 777": "DK_777.jpeg",
  "DK 7500 Yellow Maize": "DK_7500_Yellow_Maize.webp",
  "Chick Start Vetcare": "Chick_Start_Vetcare.jpg",
  "Egocin Chick Formula": "Egocin_Chick_Formula.webp",
  "Vetoxy 20%": "Vetoxy_20pct.jpg",
  "Cosmycin 20%": "Cosmycin_20pct.jpg",
  "Cosatrim Vet": "Cosatrim_Vet.webp",
  "Cosvita": "Cosvita.png",
  "Ovin": "Ovin.webp",
  "Tylodoxy Metrovet Red": "Tylodoxy_Metrovet_Red.jpg",
  "Tylodoxy 200 Blue": "Tylodoxy_200_Blue.jpg",
  "Ascarex Pet dog D": "Ascarex_Pet_dog_D.jpg",
  "Wormicid": "Wormicid.png",
  "Red Cat": "Red_Cat.jpg",
  "Biotrim Vet Plus": "Biotrim_Vet_Plus.jpg",
  "Metrocycline Soluble": "Metrocycline_Soluble.png",
  "Liquid Paraffin (Impact)": "Liquid_Paraffin_Impact.jpg",
  "Biosafe": "Biosafe.jpg",
  "Kerol": "Kerol.png",
  "Actellic Super": "Actellic_Super.jpg",
  "Skana Super": "Skana_Super.png",
  "Milking Salve Norbrook": "Milking_Salve_Norbrook.jpg",
  "Albafas 2.5%": "Albafas_2.5pct.jpg",
  "Albafas 10%": "Albafas_10pct.jpg",
  "Albendex 2.5% Vetcare": "Albendex_2.5pct_Vetcare.webp",
  "Triatix": "Triatix.jpeg",
  "Tixfix": "Tixfix.jpg",
  "Baraki Rat Pellets": "Baraki_Rat_Pellets.jpeg",
  "Ratbomb": "Ratbomb.jpg",
  "Fuko kill": "Fuko_kill.jpg",
  "Oshothion": "Oshothion.jpg",
  "Bimatraz": "Bimatraz.png",
  "Bimatraz Bimeda": "Bimatraz_Bimeda.jpg",
  "Undertaker": "Undertaker.jpeg",
  "Norotraz": "Norotraz.jpg",
  "Zetanil": "Zetanil.png",
  "Ascarten Petdog Dewormer (20/= per tablet)": "Ascarten_Petdog_Dewormer_20_=_per_tablet.jpg",
  "Parvoe Dogs Vaccine": "Parvoe_Dogs_Vaccine.jpg",
  "DHLP Dogs Vaccine": "DHLP_Dogs_Vaccine.png",
  "NCD Newcastle Poultry Vaccince (25 chicks)": "NCD_Newcastle_Poultry_Vaccince_25_chicks.jpg",
  "NCD Newcastle Poultry Vaccince (50 chicks)": "NCD_Newcastle_Poultry_Vaccince_50_chicks.jpg",
  "Ivanor": "Ivanor.jpg",
  "Dabotik 522.5 EC": "Dabotik_522.5_EC.webp",
};

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let updatedCount = 0;
    
    // First, clear all random assignments I made
    for (const p of products) {
      if (p.imageUrl && p.imageUrl.startsWith("/images/products/")) {
        await ctx.db.patch(p._id, { imageUrl: "" });
      }
    }

    // Now apply the EXACT mapping
    for (const p of products) {
      const correctImage = mapping[p.name.trim()];
      if (correctImage) {
        await ctx.db.patch(p._id, { imageUrl: `/images/products/${correctImage}` });
        updatedCount++;
      }
    }
    
    return updatedCount;
  }
});
