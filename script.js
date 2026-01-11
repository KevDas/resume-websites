// Theme: cycles Auto -> Light -> Dark
(function () {
  const root = document.documentElement;
  const key = "themePreference"; // "auto" | "light" | "dark"

  const btn = document.getElementById("themeToggle");
  const label = document.getElementById("themeLabel");
  const year = document.getElementById("year");
  const copyEmail = document.getElementById("copyEmail");

  const prefersDark = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const apply = (pref) => {
    if (pref === "auto") {
      root.removeAttribute("data-theme");
      label.textContent = "Auto";
      return;
    }
    root.setAttribute("data-theme", pref);
    label.textContent = pref[0].toUpperCase() + pref.slice(1);
  };

  const getPref = () => localStorage.getItem(key) || "auto";
  const setPref = (pref) => localStorage.setItem(key, pref);

  const cycle = (pref) => (pref === "auto" ? "light" : pref === "light" ? "dark" : "auto");

  // init
  apply(getPref());
  if (year) year.textContent = new Date().getFullYear();

  // respond to OS changes if on Auto
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", () => {
    if (getPref() === "auto") apply("auto");
  });

  btn?.addEventListener("click", () => {
    const next = cycle(getPref());
    setPref(next);
    apply(next);
  });

  copyEmail?.addEventListener("click", async () => {
    const email = copyEmail.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      const prev = copyEmail.textContent;
      copyEmail.textContent = "Copied!";
      setTimeout(() => (copyEmail.textContent = prev), 900);
    } catch {
      // fallback
      window.location.href = `mailto:${email}`;
    }
  });

  // Optional: highlight active section link (only when nav visible)
  const links = Array.from(document.querySelectorAll(".nav a"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.remove("active"));
        const active = links.find((a) => a.getAttribute("href") === `#${e.target.id}`);
        active?.classList.add("active");
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((s) => io.observe(s));
})();
