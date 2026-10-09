import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Moon, Search, Sun, UserRound, X } from "lucide-react";
import Logo from "./Logo";
import PosterArt from "./PosterArt";
import { genres, industries, searchCatalog, typeLabel } from "../data/catalog";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { pagePad, primaryBtn } from "../utils/styles";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/browse?type=movie", label: "Movies" },
  { to: "/browse?type=series", label: "Series" },
  { to: "/browse?sort=new", label: "New" },
];

const cinemaLinks = industries.map((name) => ({
  to: `/browse?industry=${encodeURIComponent(name)}`,
  label: name,
}));

function linkClass(active, solid) {
  const tone = active ? "text-copper-500 dark:text-copper-300" : solid ? "text-[var(--text)]" : "text-white/90";
  return `text-sm font-medium transition hover:text-copper-500 dark:hover:text-copper-300 ${tone}`;
}

function isLinkActive(link, location) {
  if (link.end) return location.pathname === "/";
  const [path, search = ""] = link.to.split("?");
  if (location.pathname !== path) return false;
  const expected = new URLSearchParams(search);
  const current = new URLSearchParams(location.search);
  for (const [key, value] of expected.entries()) {
    if (current.get(key) !== value) return false;
  }
  return expected.toString().length > 0;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState(null);
  const [query, setQuery] = useState("");
  const locationKey = `${location.pathname}${location.search}`;
  const [panelLocation, setPanelLocation] = useState(locationKey);
  if (panelLocation !== locationKey) {
    setPanelLocation(locationKey);
    setPanel(null);
  }

  const onHome = location.pathname === "/";
  const solid = scrolled || !onHome || panel === "mobile" || panel === "search";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!panel) return undefined;
    const onPointer = (event) => {
      if (!headerRef.current?.contains(event.target)) setPanel(null);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setPanel(null);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  useEffect(() => {
    document.body.style.overflow = panel === "mobile" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panel]);

  useEffect(() => {
    if (panel === "search") searchRef.current?.focus();
  }, [panel]);

  const results = useMemo(() => (query.trim() ? searchCatalog(query).slice(0, 6) : []), [query]);

  const submitSearch = (event) => {
    event.preventDefault();
    const next = query.trim();
    setPanel(null);
    navigate(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  };

  const iconBtn = `grid h-10 w-10 place-items-center rounded-md transition ${
    solid ? "hover:bg-[var(--bg)]" : "hover:bg-white/15"
  }`;

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-40">
      <div
        className={`transition duration-300 ${
          solid
            ? "border-b border-[var(--line)] bg-[var(--bg)]/88 text-[var(--text)] shadow-sm backdrop-blur-xl"
            : "bg-gradient-to-b from-black/75 to-transparent text-white"
        }`}
      >
        <div className={`flex h-16 items-center gap-3 sm:h-[4.5rem] ${pagePad}`}>
          <Logo tone={solid ? "theme" : "light"} />
          <nav className="ml-4 hidden items-center gap-4 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <Link key={link.label} to={link.to} className={linkClass(isLinkActive(link, location), solid)} aria-current={isLinkActive(link, location) ? "page" : undefined}>
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                aria-expanded={panel === "cinemas"}
                aria-haspopup="true"
                onClick={() => setPanel((current) => (current === "cinemas" ? null : "cinemas"))}
                className={`inline-flex items-center gap-1 ${linkClass(false, solid)}`}
              >
                Cinemas
                <ChevronDown size={16} className={`transition ${panel === "cinemas" ? "rotate-180" : ""}`} />
              </button>
              {panel === "cinemas" && (
                <div className="menu-pop absolute left-0 top-full z-50 mt-3 w-48 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-2 text-[var(--text)] shadow-2xl">
                  {cinemaLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="block rounded-xl px-3 py-2 text-sm transition hover:bg-[var(--bg)]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                aria-expanded={panel === "genres"}
                aria-haspopup="true"
                onClick={() => setPanel((current) => (current === "genres" ? null : "genres"))}
                className={`inline-flex items-center gap-1 ${linkClass(false, solid)}`}
              >
                Genres
                <ChevronDown size={16} className={`transition ${panel === "genres" ? "rotate-180" : ""}`} />
              </button>
              {panel === "genres" && (
                <div className="menu-pop absolute left-0 top-full z-50 mt-3 w-72 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-2 text-[var(--text)] shadow-2xl">
                  <div className="grid grid-cols-2 gap-1">
                    {genres.map((genre) => (
                      <Link
                        key={genre}
                        to={`/browse?genre=${encodeURIComponent(genre)}`}
                        className="rounded-xl px-3 py-2 text-sm transition hover:bg-[var(--bg)]"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              className={iconBtn}
              aria-label="Search"
              aria-expanded={panel === "search"}
              onClick={() => setPanel((current) => (current === "search" ? null : "search"))}
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              className={iconBtn}
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative hidden sm:block">
              <button
                type="button"
                className={`${iconBtn} ${user ? "bg-copper-400 text-ink-950 hover:bg-copper-300" : ""}`}
                aria-label="Account menu"
                aria-expanded={panel === "profile"}
                aria-haspopup="menu"
                onClick={() => setPanel((current) => (current === "profile" ? null : "profile"))}
              >
                {user ? (
                  <span className="text-sm font-semibold">{user.name.slice(0, 1).toUpperCase()}</span>
                ) : (
                  <UserRound size={18} />
                )}
              </button>
              {panel === "profile" && (
                <div
                  role="menu"
                  className="menu-pop absolute right-0 top-full z-50 mt-3 w-60 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] p-2 text-[var(--text)] shadow-2xl"
                >
                  {user ? (
                    <>
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                      </div>
                      <Link to="/list" role="menuitem" className="block rounded-xl px-3 py-2 text-sm hover:bg-[var(--bg)]">
                        My List
                      </Link>
                      <Link to="/account" role="menuitem" className="block rounded-xl px-3 py-2 text-sm hover:bg-[var(--bg)]">
                        Account
                      </Link>
                      <Link to="/plans" role="menuitem" className="block rounded-xl px-3 py-2 text-sm hover:bg-[var(--bg)]">
                        Plans
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          logout();
                          setPanel(null);
                        }}
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--bg)]"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <div className="grid gap-2 p-2">
                      <Link to="/login" className={`${primaryBtn} w-full`}>
                        Sign in
                      </Link>
                      <Link
                        to="/signup"
                        className="inline-flex w-full items-center justify-center rounded-full border border-[var(--line)] px-5 py-2.5 text-sm font-semibold"
                      >
                        Create account
                      </Link>
                      <Link to="/plans" className="px-2 py-1 text-center text-sm text-[var(--muted)] hover:text-[var(--text)]">
                        Plans
                      </Link>
                      <Link to="/list" className="px-2 py-1 text-center text-sm text-[var(--muted)] hover:text-[var(--text)]">
                        My List
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              className={`${iconBtn} lg:hidden`}
              aria-label={panel === "mobile" ? "Close menu" : "Open menu"}
              aria-expanded={panel === "mobile"}
              onClick={() => setPanel((current) => (current === "mobile" ? null : "mobile"))}
            >
              {panel === "mobile" ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {panel === "search" && (
          <div className="border-t border-[var(--line)] bg-[var(--bg-elev)] text-[var(--text)]">
            <form onSubmit={submitSearch} className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
              <Search size={18} className="shrink-0 text-[var(--muted)]" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles, genres, or people"
                aria-label="Search titles, genres, or people"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
              />
              {query && (
                <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </form>
            {query.trim() && (
              <div className="mx-auto max-w-3xl px-3 pb-3">
                {results.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-[var(--muted)]">No matches for “{query.trim()}”.</p>
                ) : (
                  <ul className="max-h-80 overflow-y-auto">
                    {results.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={`/title/${item.id}`}
                          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-[var(--bg)]"
                        >
                          <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md">
                            <PosterArt title={item} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold">{item.title}</span>
                            <span className="block text-xs text-[var(--muted)]">
                              {typeLabel(item.type)} · {item.year} · {item.genres.join(", ")}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <button type="button" onClick={submitSearch} className="mt-1 px-2 py-2 text-sm font-medium text-copper-700 dark:text-copper-300">
                  See all results
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {panel === "mobile" && (
        <div className="menu-pop fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-[var(--bg)] px-4 py-5 text-[var(--text)] sm:top-[4.5rem] lg:hidden">
          <form onSubmit={submitSearch} className="mb-5 flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] px-3">
            <Search size={16} className="text-[var(--muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Wickmere"
              aria-label="Search Wickmere"
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </form>
          <nav className="grid gap-1" aria-label="Mobile">
            {[...links, { to: "/list", label: "My List" }, { to: "/plans", label: "Plans" }, { to: "/account", label: "Account" }].map((link) => (
              <Link key={link.label} to={link.to} className="rounded-xl px-3 py-3 text-lg font-medium hover:bg-[var(--bg-elev)]">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Cinemas</p>
          <div className="flex flex-wrap gap-2">
            {cinemaLinks.map((link) => (
              <Link key={link.label} to={link.to} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Genres</p>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Link
                key={genre}
                to={`/browse?genre=${encodeURIComponent(genre)}`}
                className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm"
              >
                {genre}
              </Link>
            ))}
          </div>
          <div className="mt-8 grid gap-3">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setPanel(null);
                }}
                className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className={primaryBtn}>
                  Sign in
                </Link>
                <Link to="/signup" className="inline-flex items-center justify-center rounded-full border border-[var(--line)] px-5 py-3 text-sm font-semibold">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
