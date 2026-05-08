const ddragonVersion = "16.9.1";

const championAliases = {
  가렌: "Garen",
  갱플: "Gangplank",
  갱플랭크: "Gangplank",
  그웬: "Gwen",
  나르: "Gnar",
  나서스: "Nasus",
  다리우스: "Darius",
  라이즈: "Ryze",
  럼블: "Rumble",
  레넥톤: "Renekton",
  리븐: "Riven",
  말파: "Malphite",
  말파이트: "Malphite",
  모데카이저: "Mordekaiser",
  문도: "DrMundo",
  바루스: "Varus",
  베인: "Vayne",
  볼리베어: "Volibear",
  블라디미르: "Vladimir",
  뽀삐: "Poppy",
  사일러스: "Sylas",
  사이온: "Sion",
  세트: "Sett",
  쉔: "Shen",
  아칼리: "Akali",
  아트록스: "Aatrox",
  암베사: "Ambessa",
  야스오: "Yasuo",
  오로라: "Aurora",
  오른: "Ornn",
  올라프: "Olaf",
  요네: "Yone",
  우르곳: "Urgot",
  워윅: "Warwick",
  이렐: "Irelia",
  이렐리아: "Irelia",
  일라오이: "Illaoi",
  자헨: "Zaahen",
  잭스: "Jax",
  제드: "Zed",
  제이스: "Jayce",
  카밀: "Camille",
  케넨: "Kennen",
  케일: "Kayle",
  크샨테: "KSante",
  탐켄치: "TahmKench",
  "탐 켄치": "TahmKench",
  트런들: "Trundle",
  트린: "Tryndamere",
  트린다미어: "Tryndamere",
  티모: "Teemo",
  피오라: "Fiora",
};

function cleanChampionName(name) {
  return name
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function championKey(name) {
  return cleanChampionName(name).replace(/\s+/g, "");
}

function resolveChampion(name) {
  const cleaned = cleanChampionName(name);
  const id = championAliases[cleaned] || championAliases[championKey(name)];

  return {
    id,
    name: cleaned || name.trim(),
    original: name.trim(),
    image: id ? `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${id}.png` : "",
  };
}
