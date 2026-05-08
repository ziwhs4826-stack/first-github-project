const starterMatchups = [
  { enemy: "가렌", picks: ["피오라"] },
  { enemy: "갱플", picks: ["밴"] },
  { enemy: "그웬", picks: ["피오라", "트린다미어"] },
  { enemy: "나르", picks: ["말파", "오른", "트린"] },
  { enemy: "나서스", picks: ["문도", "피오라"] },
  { enemy: "다리우스", picks: ["트린", "말파", "사이온", "문도"] },
  { enemy: "라이즈", picks: ["피오라"] },
  { enemy: "럼블", picks: ["사이온", "오른", "피오라"] },
  { enemy: "리븐", picks: ["피오라", "레넥톤"] },
  { enemy: "모데카이저", picks: ["피오라"] },
  { enemy: "바루스", picks: ["사이온", "제드"] },
  { enemy: "베인", picks: ["말파(악의 이후 탱 빌드)", "제드"] },
  { enemy: "볼리베어", picks: ["문도", "말파", "사이온"] },
  { enemy: "블라디미르", picks: ["문도", "피오라"] },
  { enemy: "뽀삐", picks: ["사이온", "피오라", "문도"] },
  { enemy: "세트", picks: ["레넥톤", "문도", "피오라"] },
  { enemy: "쉔", picks: ["피오라", "문도"] },
  { enemy: "아칼리", picks: ["피오라", "제드"] },
  { enemy: "아트록스", picks: ["피오라", "말파"] },
  { enemy: "암베사", picks: ["카밀", "피오라", "레넥톤"] },
  { enemy: "야스오", picks: ["레넥톤", "트린", "말파"] },
  { enemy: "오로라", picks: ["사이온", "오른"] },
  { enemy: "오른", picks: ["피오라"] },
  { enemy: "올라프", picks: ["피오라"] },
  { enemy: "요네", picks: ["레넥톤", "피오라"] },
  { enemy: "우르곳", picks: ["사이온", "오른", "말파"] },
  { enemy: "워윅", picks: ["문도", "트린"] },
  { enemy: "이렐", picks: ["피오라", "레넥톤"] },
  { enemy: "일라오이", picks: ["피오라"] },
  { enemy: "자헨", picks: ["피오라"] },
  { enemy: "잭스", picks: ["피오라", "문도"] },
  { enemy: "제이스", picks: ["말파", "문도", "사이온"] },
  { enemy: "카밀", picks: ["레넥톤"] },
  { enemy: "케넨", picks: ["트린", "말파", "사이온", "피오라"] },
  { enemy: "케일", picks: ["트린", "말파"] },
  { enemy: "크샨테", picks: ["피오라", "카밀", "트린"] },
  { enemy: "트런들", picks: ["레넥톤"] },
  { enemy: "티모", picks: ["사이온", "문도"] },
  { enemy: "탐 켄치", picks: ["문도", "세트"] },
];

const storageKey = "lol-matchup-notes:v1";

const searchInput = document.querySelector("#searchInput");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#resultCount");
const form = document.querySelector("#matchupForm");
const enemyInput = document.querySelector("#enemyInput");
const pickInput = document.querySelector("#pickInput");
const saveBtn = document.querySelector("#saveBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const resetBtn = document.querySelector("#resetBtn");
const exportBtn = document.querySelector("#exportBtn");
const editorToggle = document.querySelector("#editorToggle");
const editorPanel = document.querySelector("#editorPanel");

let matchups = loadMatchups();
let editingEnemy = "";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

function loadMatchups() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return starterMatchups;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    localStorage.removeItem(storageKey);
  }

  return starterMatchups;
}

function saveMatchups() {
  const sorted = [...matchups].sort((a, b) => a.enemy.localeCompare(b.enemy, "ko"));
  matchups = sorted;
  localStorage.setItem(storageKey, JSON.stringify(matchups));
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function parsePicks(value) {
  return value
    .split(",")
    .map((pick) => pick.trim())
    .filter(Boolean);
}

function filterMatchups() {
  const query = normalize(searchInput.value);
  if (!query) return matchups;

  return matchups.filter((item) => {
    const enemy = normalize(item.enemy);
    return enemy.includes(query);
  });
}

function render() {
  const visible = filterMatchups();
  const query = searchInput.value.trim();

  resultCount.textContent = `${visible.length}개`;

  if (visible.length === 0) {
    results.innerHTML = `<div class="empty">검색 결과가 없습니다.</div>`;
    return;
  }

  results.innerHTML = visible
    .map(
      (item) => `
        <article class="matchup">
          <div class="row-actions">
            <button class="icon-btn edit-btn" type="button" data-action="edit" data-enemy="${escapeHtml(item.enemy)}" aria-label="${escapeHtml(item.enemy)} 수정" title="수정">✎</button>
            <button class="icon-btn delete-btn" type="button" data-action="delete" data-enemy="${escapeHtml(item.enemy)}" aria-label="${escapeHtml(item.enemy)} 삭제" title="삭제">×</button>
          </div>
          <div class="enemy-card">
            ${renderPortrait(item.enemy, "large")}
            <div class="enemy-meta">
              <span class="enemy-kicker">ENEMY</span>
              <div class="enemy">${escapeHtml(item.enemy)}</div>
            </div>
          </div>
          <div class="picks-wrap">
            <span class="pick-kicker">COUNTER PICKS</span>
            <div class="picks">
              ${item.picks.map((pick) => renderPickChip(pick)).join("")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPickChip(pick) {
  return `
    <span class="pick" title="${escapeHtml(pick)}">
      ${renderPortrait(pick, "small")}
      <span class="pick-name">${escapeHtml(pick)}</span>
    </span>
  `;
}

function renderPortrait(name, size) {
  const champion = resolveChampion(name);
  const fallback = escapeHtml((champion.name || "?").slice(0, 1));
  const label = escapeHtml(champion.original || champion.name);
  const image = champion.image
    ? `<img src="${champion.image}" alt="" loading="lazy" onerror="this.remove(); this.parentElement.classList.add('is-fallback');" />`
    : "";

  return `
    <span class="portrait portrait-${size}" title="${label}" aria-label="${label}">
      ${image}
      <span class="portrait-fallback">${fallback}</span>
    </span>
  `;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function clearForm() {
  editingEnemy = "";
  form.reset();
  saveBtn.textContent = "추가";
  cancelBtn.hidden = true;
}

function setEditorOpen(isOpen) {
  editorPanel.hidden = !isOpen;
  editorToggle.classList.toggle("is-open", isOpen);
  editorToggle.setAttribute("aria-label", isOpen ? "데이터 편집 닫기" : "데이터 편집 열기");
}

function upsertMatchup(enemy, picks) {
  const existingIndex = matchups.findIndex((item) => normalize(item.enemy) === normalize(editingEnemy || enemy));
  const nextItem = { enemy, picks };

  if (existingIndex >= 0) {
    matchups.splice(existingIndex, 1, nextItem);
  } else {
    matchups.push(nextItem);
  }

  saveMatchups();
  clearForm();
  render();
}

searchInput.addEventListener("input", render);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const enemy = enemyInput.value.trim();
  const picks = parsePicks(pickInput.value);
  if (!enemy || picks.length === 0) return;
  upsertMatchup(enemy, picks);
});

cancelBtn.addEventListener("click", clearForm);

results.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const enemy = button.dataset.enemy;
  const item = matchups.find((entry) => entry.enemy === enemy);
  if (!item) return;

  if (button.dataset.action === "edit") {
    setEditorOpen(true);
    editingEnemy = item.enemy;
    enemyInput.value = item.enemy;
    pickInput.value = item.picks.join(", ");
    saveBtn.textContent = "저장";
    cancelBtn.hidden = false;
    enemyInput.focus();
  }

  if (button.dataset.action === "delete") {
    matchups = matchups.filter((entry) => entry.enemy !== enemy);
    saveMatchups();
    render();
  }
});

resetBtn.addEventListener("click", () => {
  matchups = starterMatchups;
  saveMatchups();
  clearForm();
  render();
});

exportBtn.addEventListener("click", async () => {
  const text = matchups.map((item) => `${item.enemy} -> ${item.picks.join(", ")}`).join("\n");
  await navigator.clipboard.writeText(text);
  exportBtn.textContent = "복사됨";
  window.setTimeout(() => {
    exportBtn.textContent = "내보내기";
  }, 1200);
});

editorToggle.addEventListener("click", () => {
  setEditorOpen(editorPanel.hidden);
});

saveMatchups();
render();
