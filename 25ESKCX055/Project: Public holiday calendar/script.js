/* ============================================================
   script.js — Utsav Calendar
   Vanilla ES6. Reads data from holidays.js (RAW_HOLIDAYS,
   HOLIDAY_INSTANCES, YEARS_SUPPORTED, CATEGORY_LABELS).
   ============================================================ */

(() => {
  "use strict";

  /* ---------- STATE ---------- */
  const state = {
    theme: localStorage.getItem("uc_theme") || "light",
    viewMonth: new Date().getMonth(),
    viewYear: new Date().getFullYear(),
    favourites: JSON.parse(localStorage.getItem("uc_favourites") || "[]"),
    customHolidays: JSON.parse(localStorage.getItem("uc_custom") || "[]"),
    filters: { search: "", month: "", category: "", religion: "", year: "" },
    activeHolidayId: null
  };
  if (!YEARS_SUPPORTED.includes(state.viewYear)) state.viewYear = YEARS_SUPPORTED[0];

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ============================================================
     THEME
     ============================================================ */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    $("#themeToggle").innerHTML = state.theme === "dark"
      ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
  $("#themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("uc_theme", state.theme);
    applyTheme();
  });
  applyTheme();

  /* ============================================================
     LOADER + SCROLL PROGRESS + NAVBAR
     ============================================================ */
  window.addEventListener("load", () => {
    setTimeout(() => $("#loader").classList.add("hidden"), 500);
  });

  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    $("#scrollProgress").style.width = `${scrolled}%`;
    $("#backToTop").classList.toggle("show", h.scrollTop > 600);
  });

  $("#hamburger").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
  $$(".nav-links a").forEach((a) => a.addEventListener("click", () => $("#navLinks").classList.remove("open")));
  $("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ============================================================
     LIVE CLOCK + GREETING + TODAY BANNER
     ============================================================ */
  function todaysHolidays() {
    const iso = new Date().toISOString().slice(0, 10);
    return HOLIDAY_INSTANCES.filter((h) => h.iso === iso);
  }

  function greetingFor(hour) {
    if (hour < 5) return "Good Night";
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  }

  function tickClock() {
    const now = new Date();
    $("#clockTime").textContent = now.toLocaleTimeString("en-IN", { hour12: true });
    $("#clockDate").textContent = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    $("#clockDay").textContent = now.toLocaleDateString("en-IN", { weekday: "long" });
    $("#greeting").textContent = `${greetingFor(now.getHours())} 🙏`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  function renderTodayBanner() {
    const list = todaysHolidays();
    const el = $("#heroToday");
    if (list.length) {
      el.innerHTML = `<span>${list[0].emoji}</span> Today is <strong>${list[0].name}</strong> — Happy ${list[0].name}!`;
      launchConfetti();
    } else {
      el.innerHTML = "";
    }
  }

  /* ============================================================
     COUNTDOWN TO NEXT HOLIDAY
     ============================================================ */
  function getUpcomingHoliday() {
    const now = new Date();
    return HOLIDAY_INSTANCES.find((h) => h.date >= new Date(now.toDateString()));
  }

  function tickCountdown() {
    const next = getUpcomingHoliday();
    if (!next) return;
    const now = new Date();
    const diff = next.date - now;
    const days = Math.max(0, Math.floor(diff / 86400000));
    const hours = Math.max(0, Math.floor((diff / 3600000) % 24));
    const mins = Math.max(0, Math.floor((diff / 60000) % 60));
    const secs = Math.max(0, Math.floor((diff / 1000) % 60));
    $("#cdEmoji").textContent = next.emoji;
    $("#cdTitle").textContent = days === 0 ? `${next.name} is today!` : `Next up: ${next.name}`;
    $("#cdSub").textContent = next.date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    $("#cdDays").textContent = String(days).padStart(2, "0");
    $("#cdHours").textContent = String(hours).padStart(2, "0");
    $("#cdMinutes").textContent = String(mins).padStart(2, "0");
    $("#cdSeconds").textContent = String(secs).padStart(2, "0");
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  $("#notifyBtn").addEventListener("click", async () => {
    if (!("Notification" in window)) { showToast("Notifications aren't supported in this browser."); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      showToast("You'll be notified about upcoming holidays in this session.");
      const next = getUpcomingHoliday();
      const msUntil = next.date - new Date();
      if (msUntil > 0 && msUntil < 2147483647) {
        setTimeout(() => new Notification(`${next.emoji} ${next.name} is here!`, { body: next.quote }), msUntil);
      }
    } else {
      showToast("Notification permission denied.");
    }
  });

  /* ============================================================
     TOAST
     ============================================================ */
  let toastTimer;
  function showToast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
  }

  /* ============================================================
     CALENDAR
     ============================================================ */
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function populateCalendarControls() {
    const monthSelect = $("#monthSelect");
    monthSelect.innerHTML = monthNames.map((m, i) => `<option value="${i}">${m}</option>`).join("");
    const yearSelect = $("#yearSelect");
    yearSelect.innerHTML = YEARS_SUPPORTED.map((y) => `<option value="${y}">${y}</option>`).join("");
  }

  function renderCalendar() {
    $("#monthSelect").value = state.viewMonth;
    $("#yearSelect").value = state.viewYear;

    const grid = $("#calendarGrid");
    grid.innerHTML = "";
    const firstDay = new Date(state.viewYear, state.viewMonth, 1).getDay();
    const daysInMonth = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();
    const today = new Date();
    const monthHolidays = HOLIDAY_INSTANCES.filter((h) => h.year === state.viewYear && h.date.getMonth() === state.viewMonth);
    const customForMonth = state.customHolidays.filter((h) => {
      const d = new Date(h.date);
      return d.getFullYear() === state.viewYear && d.getMonth() === state.viewMonth;
    });

    for (let i = 0; i < firstDay; i++) {
      grid.insertAdjacentHTML("beforeend", `<div class="cal-day empty"></div>`);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(state.viewYear, state.viewMonth, d);
      const dow = dateObj.getDay();
      const isWeekend = dow === 0 || dow === 6;
      const isToday = dateObj.toDateString() === today.toDateString();
      const holiday = monthHolidays.find((h) => h.date.getDate() === d);
      const custom = customForMonth.find((h) => new Date(h.date).getDate() === d);

      const classes = ["cal-day"];
      if (isWeekend) classes.push("weekend");
      if (isToday) classes.push("today");
      if (holiday || custom) classes.push("holiday");

      const emojiHtml = holiday ? `<span class="day-emoji">${holiday.emoji}</span>` : custom ? `<span class="day-emoji">📌</span>` : "";
      grid.insertAdjacentHTML("beforeend",
        `<div class="${classes.join(" ")}" data-holiday-id="${holiday ? holiday.id : ""}" data-day="${d}" title="${holiday ? holiday.name : custom ? custom.name : ""}">
          <span class="day-num">${d}</span>${emojiHtml}
        </div>`);
    }

    $$(".cal-day.holiday").forEach((el) => {
      el.addEventListener("click", () => {
        const id = el.getAttribute("data-holiday-id");
        if (id) openModalById(id, state.viewYear);
      });
    });
  }

  $("#prevMonth").addEventListener("click", () => {
    state.viewMonth--;
    if (state.viewMonth < 0) { state.viewMonth = 11; changeYear(-1); }
    renderCalendar();
  });
  $("#nextMonth").addEventListener("click", () => {
    state.viewMonth++;
    if (state.viewMonth > 11) { state.viewMonth = 0; changeYear(1); }
    renderCalendar();
  });
  function changeYear(delta) {
    const idx = YEARS_SUPPORTED.indexOf(state.viewYear);
    const newIdx = Math.min(YEARS_SUPPORTED.length - 1, Math.max(0, idx + delta));
    state.viewYear = YEARS_SUPPORTED[newIdx];
  }
  $("#monthSelect").addEventListener("change", (e) => { state.viewMonth = Number(e.target.value); renderCalendar(); });
  $("#yearSelect").addEventListener("change", (e) => { state.viewYear = Number(e.target.value); renderCalendar(); renderAllDependentViews(); });
  $("#todayBtn").addEventListener("click", () => {
    const now = new Date();
    state.viewMonth = now.getMonth();
    state.viewYear = YEARS_SUPPORTED.includes(now.getFullYear()) ? now.getFullYear() : YEARS_SUPPORTED[0];
    renderCalendar();
  });

  /* ============================================================
     HOLIDAY LIST + FILTERS + SEARCH
     ============================================================ */
  function populateFilterControls() {
    const filterMonth = $("#filterMonth");
    monthNames.forEach((m, i) => filterMonth.insertAdjacentHTML("beforeend", `<option value="${i}">${m}</option>`));
    const filterYear = $("#filterYear");
    filterYear.innerHTML = `<option value="">All Years</option>` + YEARS_SUPPORTED.map((y) => `<option value="${y}">${y}</option>`).join("");
  }

  function matchesFilters(h) {
    const f = state.filters;
    const searchStr = `${h.name} ${h.hindiName} ${h.englishName} ${h.religion} ${h.states.join(" ")} ${h.category} ${h.monthName}`.toLowerCase();
    if (f.search && !searchStr.includes(f.search.toLowerCase())) return false;
    if (f.month !== "" && h.date.getMonth() !== Number(f.month)) return false;
    if (f.category && h.category !== f.category) return false;
    if (f.religion && h.religion !== f.religion) return false;
    if (f.year && h.year !== Number(f.year)) return false;
    return true;
  }

  function renderHolidayGrid() {
    const filtered = HOLIDAY_INSTANCES.filter(matchesFilters);
    const grid = $("#holidayGrid");
    grid.innerHTML = filtered.map((h) => `
      <article class="holiday-card" data-id="${h.id}" data-year="${h.year}">
        <div class="hc-banner" style="background:${h.color}">
          <span class="hc-tag">${CATEGORY_LABELS[h.category] || h.category}</span>
          ${h.emoji}
        </div>
        <div class="hc-body">
          <h4>${h.name}</h4>
          <p class="hc-hindi">${h.hindiName}</p>
          <div class="hc-meta">
            <span>${h.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${h.year}</span>
            <span>${h.dayName}</span>
          </div>
        </div>
      </article>`).join("");
    $("#emptyState").hidden = filtered.length !== 0;

    $$(".holiday-card").forEach((card) => {
      card.addEventListener("click", () => openModalById(card.dataset.id, Number(card.dataset.year)));
    });
  }

  $("#listSearch").addEventListener("input", (e) => { state.filters.search = e.target.value; renderHolidayGrid(); });
  $("#filterMonth").addEventListener("change", (e) => { state.filters.month = e.target.value; renderHolidayGrid(); });
  $("#filterCategory").addEventListener("change", (e) => { state.filters.category = e.target.value; renderHolidayGrid(); });
  $("#filterReligion").addEventListener("change", (e) => { state.filters.religion = e.target.value; renderHolidayGrid(); });
  $("#filterYear").addEventListener("change", (e) => { state.filters.year = e.target.value; renderHolidayGrid(); });

  /* ---------- Global search overlay ---------- */
  $("#searchToggle").addEventListener("click", () => {
    $("#searchOverlay").classList.add("active");
    $("#globalSearch").focus();
  });
  $("#searchClose").addEventListener("click", () => $("#searchOverlay").classList.remove("active"));
  $("#globalSearch").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const box = $("#searchResults");
    if (!q) { box.innerHTML = ""; return; }
    const results = HOLIDAY_INSTANCES.filter((h) =>
      `${h.name} ${h.hindiName} ${h.religion} ${h.states.join(" ")} ${h.category} ${h.monthName}`.toLowerCase().includes(q)
    ).slice(0, 10);
    box.innerHTML = results.map((h) =>
      `<div class="sr-item" data-id="${h.id}" data-year="${h.year}"><span>${h.emoji}</span> ${h.name} — ${h.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>`
    ).join("") || `<div class="sr-item">No matches found.</div>`;
    $$(".sr-item[data-id]").forEach((item) => item.addEventListener("click", () => {
      $("#searchOverlay").classList.remove("active");
      openModalById(item.dataset.id, Number(item.dataset.year));
    }));
  });

  /* ============================================================
     GALLERY
     ============================================================ */
  function renderGallery() {
    const picks = RAW_HOLIDAYS.slice(0, 12);
    $("#galleryGrid").innerHTML = picks.map((h) =>
      `<div class="gallery-item" style="background:${h.color}" data-id="${h.id}">
        <span>${h.emoji} ${h.name}</span>
      </div>`).join("");
    $$(".gallery-item").forEach((el) => el.addEventListener("click", () => openModalById(el.dataset.id, state.viewYear)));
  }

  /* ============================================================
     STATISTICS
     ============================================================ */
  function renderStats() {
    const year = state.viewYear;
    const yearHolidays = HOLIDAY_INSTANCES.filter((h) => h.year === year);
    const now = new Date();
    const counts = {
      total: yearHolidays.length,
      national: yearHolidays.filter((h) => h.category === "national").length,
      gazetted: yearHolidays.filter((h) => h.category === "gazetted").length,
      restricted: yearHolidays.filter((h) => h.category === "restricted").length,
      state: yearHolidays.filter((h) => h.category === "state").length,
      thisMonth: yearHolidays.filter((h) => h.date.getMonth() === now.getMonth()).length,
      upcoming: yearHolidays.filter((h) => h.date >= new Date(now.toDateString())).length,
      completed: yearHolidays.filter((h) => h.date < new Date(now.toDateString())).length
    };
    const cards = [
      ["Total Holidays", counts.total, "fa-calendar-check"],
      ["National", counts.national, "fa-flag"],
      ["Gazetted", counts.gazetted, "fa-stamp"],
      ["Restricted", counts.restricted, "fa-user-clock"],
      ["State", counts.state, "fa-map-location-dot"],
      ["This Month", counts.thisMonth, "fa-calendar-day"],
      ["Upcoming", counts.upcoming, "fa-hourglass-half"],
      ["Completed", counts.completed, "fa-circle-check"]
    ];
    $("#statsGrid").innerHTML = cards.map(([label, num, icon]) => `
      <div class="stat-card">
        <i class="fa-solid ${icon}" style="color:var(--maroon)"></i>
        <div class="stat-num">${num}</div>
        <div class="stat-label">${label} (${year})</div>
      </div>`).join("");
  }

  /* ============================================================
     FESTIVAL OF THE MONTH / QUOTE / FACT
     ============================================================ */
  function renderFestivalOfMonth() {
    const now = new Date();
    const candidates = HOLIDAY_INSTANCES.filter((h) => h.year === now.getFullYear() && h.date.getMonth() === now.getMonth());
    const pick = candidates[0] || HOLIDAY_INSTANCES[0];
    $("#fomContent").innerHTML = `
      <h3>${pick.emoji} ${pick.name}</h3>
      <p>${pick.history}</p>
      <button class="btn btn-outline small" data-id="${pick.id}" data-year="${pick.year}">View Details</button>`;
    $("#fomContent button").addEventListener("click", (e) => openModalById(e.target.closest("button").dataset.id, Number(e.target.closest("button").dataset.year)));
  }

  function randomQuote() {
    const pool = RAW_HOLIDAYS.filter((h) => h.quote);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    $("#quoteText").textContent = `"${pick.quote}" — ${pick.name}`;
  }
  function randomFact() {
    const pool = RAW_HOLIDAYS.filter((h) => h.facts && h.facts.length);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const fact = pick.facts[Math.floor(Math.random() * pick.facts.length)];
    $("#factText").textContent = `${fact} (${pick.name})`;
  }
  $("#newQuoteBtn").addEventListener("click", randomQuote);
  $("#newFactBtn").addEventListener("click", randomFact);

  /* ============================================================
     MODAL
     ============================================================ */
  function findInstance(id, year) {
    return HOLIDAY_INSTANCES.find((h) => h.id === id && h.year === year) ||
           HOLIDAY_INSTANCES.find((h) => h.id === id);
  }

  function openModalById(id, year) {
    const h = findInstance(id, year);
    if (!h) return;
    state.activeHolidayId = h.id;

    $("#modalBanner").style.background = h.color;
    $("#modalEmoji").textContent = h.emoji;
    $("#modalCategory").textContent = CATEGORY_LABELS[h.category] || h.category;
    $("#modalName").textContent = h.name;
    $("#modalHindi").textContent = h.hindiName;
    $("#modalDate").textContent = `${h.date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} (${h.dayName})`;

    const now = new Date();
    const diffDays = Math.ceil((h.date - now) / 86400000);
    $("#modalCountdown").textContent = diffDays === 0 ? "Today!" : diffDays > 0 ? `${diffDays} days away` : `${Math.abs(diffDays)} days ago`;

    $("#modalHistory").textContent = h.history;
    $("#modalImportance").textContent = h.importance;
    $("#modalCelebration").textContent = h.celebration;
    $("#modalFoods").textContent = h.foods.join(", ");
    $("#modalDress").textContent = h.dress;
    $("#modalDecoration").textContent = h.decoration;
    $("#modalStates").textContent = h.states.join(", ");
    $("#modalFacts").innerHTML = h.facts.map((f) => `<li>${f}</li>`).join("");
    $("#modalQuote").textContent = h.quote;
    $("#modalWiki").href = h.wiki;
    $("#modalGov").href = h.govLink;

    resetModalTabs();
    $("#modalOverlay").classList.add("active");
  }

  function closeModal() { $("#modalOverlay").classList.remove("active"); }
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalOverlay").addEventListener("click", (e) => { if (e.target.id === "modalOverlay") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  function resetModalTabs() {
    $$(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === 0));
    $$(".modal-tab-panel").forEach((p, i) => p.hidden = i !== 0);
  }
  $$(".tab-btn").forEach((btn) => btn.addEventListener("click", () => {
    $$(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    $$(".modal-tab-panel").forEach((p) => p.hidden = p.id !== `panel-${btn.dataset.tab}`);
  }));

  $("#modalGCal").addEventListener("click", () => {
    const h = findInstance(state.activeHolidayId, state.viewYear);
    const d = h.iso.replace(/-/g, "");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(h.name)}&dates=${d}/${d}&details=${encodeURIComponent(h.history)}`;
    window.open(url, "_blank", "noopener");
  });

  $("#modalIcs").addEventListener("click", () => {
    const h = findInstance(state.activeHolidayId, state.viewYear);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//UtsavCalendar//EN",
      "BEGIN:VEVENT",
      `UID:${h.id}-${h.year}@utsavcalendar`,
      `DTSTART;VALUE=DATE:${h.iso.replace(/-/g, "")}`,
      `SUMMARY:${h.name}`,
      `DESCRIPTION:${h.history.replace(/\n/g, " ")}`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    downloadBlob(ics, `${h.id}.ics`, "text/calendar");
  });

  $("#modalShare").addEventListener("click", async () => {
    const h = findInstance(state.activeHolidayId, state.viewYear);
    const text = `${h.emoji} ${h.name} — ${h.date.toDateString()}`;
    if (navigator.share) {
      try { await navigator.share({ title: h.name, text }); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    }
  });

  $("#modalFav").addEventListener("click", () => {
    const id = state.activeHolidayId;
    const idx = state.favourites.indexOf(id);
    if (idx > -1) { state.favourites.splice(idx, 1); showToast("Removed from favourites"); }
    else { state.favourites.push(id); showToast("Added to favourites"); }
    localStorage.setItem("uc_favourites", JSON.stringify(state.favourites));
  });

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  /* ============================================================
     DOWNLOADS / PRINT
     ============================================================ */
  $("#downloadJson").addEventListener("click", () => {
    const data = HOLIDAY_INSTANCES.filter((h) => h.year === state.viewYear)
      .map(({ date, ...rest }) => ({ ...rest, date: rest.iso }));
    downloadBlob(JSON.stringify(data, null, 2), `indian-holidays-${state.viewYear}.json`, "application/json");
  });

  $("#downloadCsv").addEventListener("click", () => {
    const rows = HOLIDAY_INSTANCES.filter((h) => h.year === state.viewYear);
    const header = "Name,Hindi Name,Date,Day,Category,Religion,States\n";
    const csv = header + rows.map((h) =>
      `"${h.name}","${h.hindiName}","${h.iso}","${h.dayName}","${h.category}","${h.religion}","${h.states.join("; ")}"`
    ).join("\n");
    downloadBlob(csv, `indian-holidays-${state.viewYear}.csv`, "text/csv");
  });

  $("#printCalendar").addEventListener("click", () => window.print());

  /* ============================================================
     CONFETTI
     ============================================================ */
  function launchConfetti() {
    const canvas = $("#confettiCanvas");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.classList.add("active");
    const ctx = canvas.getContext("2d");
    const colors = ["#F4A324", "#C1440E", "#146356", "#D4AF37", "#7209B7"];
    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width, y: -20 - Math.random() * canvas.height,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      speed: 2 + Math.random() * 3, drift: -1 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)], rot: Math.random() * 360
    }));
    let frames = 0;
    const anim = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.speed; p.x += p.drift; p.rot += 4;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frames++;
      if (frames < 220) requestAnimationFrame(anim);
      else canvas.classList.remove("active");
    };
    anim();
  }

  /* ============================================================
     ADMIN PANEL (localStorage CRUD)
     ============================================================ */
  function renderAdminList() {
    const list = $("#adminList");
    if (!state.customHolidays.length) {
      list.innerHTML = `<p class="empty-state">No custom holidays added yet.</p>`;
      return;
    }
    list.innerHTML = state.customHolidays.map((h, i) => `
      <div class="admin-item">
        <div><strong>${h.name}</strong><br><small>${h.date} · ${h.state || "—"} · ${h.category}</small></div>
        <button data-idx="${i}" aria-label="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>`).join("");
    $$(".admin-item button").forEach((btn) => btn.addEventListener("click", () => {
      state.customHolidays.splice(Number(btn.dataset.idx), 1);
      localStorage.setItem("uc_custom", JSON.stringify(state.customHolidays));
      renderAdminList();
      renderCalendar();
    }));
  }

  $("#adminForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const h = {
      name: $("#admName").value.trim(),
      date: $("#admDate").value,
      state: $("#admState").value.trim(),
      category: $("#admCategory").value,
      notes: $("#admNotes").value.trim()
    };
    if (!h.name || !h.date) return;
    state.customHolidays.push(h);
    localStorage.setItem("uc_custom", JSON.stringify(state.customHolidays));
    e.target.reset();
    renderAdminList();
    renderCalendar();
    showToast("Custom holiday saved locally.");
  });

  /* ============================================================
     CONTACT FORM (front-end only)
     ============================================================ */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    showToast("Thanks! This demo form doesn't send data anywhere.");
  });

  /* ============================================================
     INIT
     ============================================================ */
  function renderAllDependentViews() {
    renderHolidayGrid();
    renderStats();
  }

  function init() {
    populateCalendarControls();
    populateFilterControls();
    renderCalendar();
    renderHolidayGrid();
    renderGallery();
    renderStats();
    renderFestivalOfMonth();
    randomQuote();
    randomFact();
    renderTodayBanner();
    renderAdminList();
  }
  init();
})();
