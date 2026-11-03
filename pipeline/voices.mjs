// Finds the ElevenLabs voice for VOICE: an id, part of a name on the account,
// or a link to a voice (Voice Library, a share link, anything with the id in
// it). A Voice Library voice that is not on the account yet gets added.
//
//   resolveVoice("Linh Chi")  ->  { voiceId: "smHgfqI7ihNDlaBs0X9I", name: "Linh Chi - ..." }
import { need } from "./lib.mjs";

const API = "https://api.elevenlabs.io";
const ID = /^[A-Za-z0-9]{20}$/;

// The voice id (and owner, for share links) in a pasted link.
const fromLink = (value) => {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const share = url.pathname.match(/\/share\/([0-9a-f]{20,})\/([A-Za-z0-9]{20})/);
  if (share) return { owner: share[1], id: share[2] };
  for (const v of url.searchParams.values()) if (ID.test(v)) return { id: v };
  const part = url.pathname.split("/").find((p) => ID.test(p));
  return part ? { id: part } : null;
};

export const resolveVoice = async (value) => {
  const headers = { "xi-api-key": need("ELEVENLABS_API_KEY") };
  const get = async (path) => {
    const res = await fetch(`${API}${path}`, { headers, signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`ElevenLabs ${path}: ${res.status} ${await res.text()}`);
    return res.json();
  };
  const voices = (await get("/v2/voices?page_size=100")).voices ?? [];
  const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

  const link = fromLink(value);
  const id = link?.id ?? (ID.test(value) ? value : null);
  if (!id) {
    const voice = voices.find((v) => fold(v.name).includes(fold(value)));
    if (voice) return { voiceId: voice.voice_id, name: voice.name };
    const names = voices.filter((v) => v.labels?.language === "vi").map((v) => v.name.split(" - ")[0]);
    throw new Error(`không có giọng "${value}"; giọng tiếng Việt có sẵn: ${names.join(", ")}, hoặc dán link giọng`);
  }

  const mine = voices.find((v) => v.voice_id === id);
  if (mine) return { voiceId: id, name: mine.name };

  // Not on the account: find it in the Voice Library and add it.
  const shared = (await get(`/v1/shared-voices?page_size=5&search=${id}`)).voices?.find((v) => v.voice_id === id);
  const owner = link?.owner ?? shared?.public_owner_id;
  if (!owner) throw new Error(`không tìm thấy giọng ${id} trong Voice Library của ElevenLabs`);
  const name = shared?.name ?? id;
  const res = await fetch(`${API}/v1/voices/add/${owner}/${id}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ new_name: name }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`thêm giọng ${name} vào tài khoản ElevenLabs: ${res.status} ${await res.text()}`);
  const { voice_id } = await res.json();
  console.log(`Added voice ${name} from the Voice Library`);
  return { voiceId: voice_id ?? id, name };
};
