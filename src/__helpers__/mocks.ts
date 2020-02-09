import { Modlist, ModFile, FileName, Game } from "@modwatch/types";

export const profile: Partial<Modlist> = {
  timestamp: new Date("1995-12-17T03:24:00"),
  tag: "Tag",
  game: "skyrim",
  enb: "Shiny ENB"
};

export const plugins: ModFile = [
  "*UHDAP - en0.esp",
  "*UHDAP - en1.esp",
  "*UHDAP - en2.esp",
  "*UHDAP - en3.esp",
  "*UHDAP - en4.esp",
  "*UHDAP - MusicHQ.esp",
  "*RSkyrimChildren.esm",
  "*Unofficial Skyrim Special Edition Patch.esp",
  "*Lanterns Of Skyrim - All In One - Main.esm",
  "*Skyrim Project Optimization - No Homes - Full Version.esm",
  "*FISS.esp",
  "*LegacyoftheDragonborn.esm",
  "*Dave'sMajesticMountains_Landscape.esm",
  "*DwemerGatesNoRelock.esl",
  "*BBLuxurySuite.esm",
  "*DynDOLOD.esm",
  "*hdtHighHeel.esm",
  "*ApachiiHair.esm"
];
export const modlist: ModFile = [
  "-Recently Installed_separator",
  "+FNIS [Output]",
  "+BodySlide Output",
  "+DynDOLOD_Output",
  "+Know Your Enemy [Output]",
  "+ENB Light [Output]",
  "+Racemenu Presets",
  "-33 PATCHER OUTPUT_separator",
  "+GAMEPLAY – Conflict Resolution Patch",
  "+VISUALS – Conflict Resolution Patch",
  "+CORE – Conflict Resolution Patch",
  "-32 CONFLICT RESOLUTION_separator",
  "+Charrmers - The Eyes Of Beauty Compability",
  "+OMEGA AIO"
];
export const ini: ModFile = [
  "[Actor]",
  "bUseNavMeshForMovement=0",
  "[Animation]",
  "fMaxFrameCounterDifferenceToConsiderVisible=0.06666667",
  "[Archive]",
  "bLoadArchiveInMemory=1",
  "sArchiveToLoadInMemoryList=Skyrim - Animations.bsa",
  "sResourceArchiveList=Skyrim - Misc.bsa, Skyrim - Shaders.bsa, Skyrim - Interface.bsa, Skyrim - Animations.bsa, Skyrim - Meshes0.bsa, Skyrim - Meshes1.bsa, Skyrim - Sounds.bsa",
  "sResourceArchiveList2=Skyrim - Voices_en0.bsa, Skyrim - Textures0.bsa, Skyrim - Textures1.bsa, Skyrim - Textures2.bsa, Skyrim - Textures3.bsa, Skyrim - Textures4.bsa, Skyrim - Textures5.bsa, Skyrim - Textures6.bsa, Skyrim - Textures7.bsa, Skyrim - Textures8.bsa, Skyrim - Patch.bsa",
  "[Audio]",
  "fMenuModeFadeInTime=1.0",
  "fMenuModeFadeOutTime=3.0",
  "fMusicDuckingSeconds=6.0",
  "fMusicUnDuckingSeconds=8.0",
  "[Bethesda.net]",
  "bEnablePlatform=0"
];
export const prefsini: ModFile = [
  "[AudioMenu]",
  "fAudioMasterVolume=0.6000",
  "fVal0=0.1500",
  "fVal1=0.3500",
  "fVal2=1.0000",
  "fVal3=0.3000",
  "fVal4=0.1500",
  "fVal5=1.0000",
  "fVal6=0.5000",
  "fVal7=1.0000",
  "uID0=94881",
  "uID1=1007612",
  "uID2=554685",
  "uID3=466532",
  "uID4=522251",
  "uID5=410705",
  "uID6=106685",
  "uID7=573393613",
  "[Bethesda.net]",
  "uPersistentUuidData0=3251767419",
  "uPersistentUuidData1=880756506",
  "uPersistentUuidData2=2788829086",
  "uPersistentUuidData3=1390707462"
];
export const game: Game = "skyrim";
export const files: { [key: string]: number } = {
  plugins: plugins.length,
  modlist: modlist.length,
  ini: ini.length,
  prefsini: prefsini.length
};

export const all: Partial<Modlist> = {
  ...profile,
  plugins,
  files
};

export const users: Partial<Modlist>[] = [
  { username: "Peanut", timestamp: new Date("1995-12-17T03:24:00") },
  { username: "Peanut New", timestamp: new Date("1995-12-17T03:24:00") },
  { username: "Sunconure11", timestamp: new Date("1995-12-17T03:23:54") },
  { username: "eeekief", timestamp: new Date("1995-12-17T03:23:20") },
  { username: "alcyonemods", timestamp: new Date("1995-12-17T03:22:49") },
  { username: "aaronth07", timestamp: new Date("1995-12-17T03:22:47") },
  { username: "MickSonger", timestamp: new Date("1995-12-17T03:22:27") },
  { username: "Arthandis", timestamp: new Date("1995-12-17T03:22:00") },
  {
    username: "FollowTheLaser",
    timestamp: new Date("1995-12-17T03:20:34")
  },
  { username: "OsirisNGaming", timestamp: new Date("1995-12-17T03:20:15") },
  { username: "krrptd", timestamp: new Date("1995-12-17T03:20:13") },
  {
    timestamp: new Date("1995-12-17T03:20:03"),
    username: "Flintlocksagerider"
  }
];

const iat = new Date("1995-12-17T03:24:00").getTime();
export const token = {
  iss: "http://localhost:3000/",
  aud: "http://localhost:3001/",
  sub: "Peanut",
  iat,
  exp: iat + 3600 * 1000,
  scopes: ["user"]
};
