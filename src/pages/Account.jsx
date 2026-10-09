import { Link, Navigate } from "react-router-dom";
import { getPlan, planPrice } from "../data/plans";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatDate, formatInr, formatJoined, initials } from "../utils/format";
import { pagePad, primaryBtn, surfaceBtn } from "../utils/styles";

export default function Account() {
  const { user, logout } = useAuth();
  const { list } = useLibrary();
  usePageTitle("Account");

  if (!user) return <Navigate to="/login" replace state={{ from: "/account" }} />;

  const plan = getPlan(user.subscription?.planId);
  const cycle = user.subscription?.cycle === "year" ? "year" : "month";

  return (
    <div className={`${pagePad} pb-16 pt-24 sm:pt-28`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-700 dark:text-copper-300">Account</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Your seat</h1>
      <div className="mt-8 grid max-w-3xl gap-6 rounded-3xl border border-[var(--line)] bg-[var(--bg-elev)] p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        <div
          className="grid h-20 w-20 place-items-center rounded-full font-display text-3xl text-ink-950"
          style={{ background: "linear-gradient(145deg, #d2ff3d, #8b6cff)" }}
          aria-hidden="true"
        >
          {initials(user.name)}
        </div>
        <div>
          <h2 className="font-display text-3xl">{user.name}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Member since</dt>
              <dd className="mt-1">{formatJoined(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">My List</dt>
              <dd className="mt-1">
                <Link to="/list" className="hover:text-copper-700 dark:hover:text-copper-300">
                  {list.length} saved {list.length === 1 ? "title" : "titles"}
                </Link>
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
            This profile lives in the browser. Signing out keeps your list on the device and clears the session.
          </p>
          <button type="button" onClick={logout} className={`${surfaceBtn} mt-6`}>
            Sign out
          </button>
        </div>
      </div>

      <section className="mt-6 max-w-3xl rounded-3xl border border-[var(--line)] bg-[var(--bg-elev)] p-6 sm:p-8" aria-labelledby="plan-heading">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Subscription</p>
        {plan ? (
          <>
            <h2 id="plan-heading" className="mt-2 font-display text-3xl">{plan.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{plan.tagline}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Price</dt>
                <dd className="mt-1">{formatInr(planPrice(plan, cycle))} / {cycle === "year" ? "year" : "month"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Started</dt>
                <dd className="mt-1">{formatDate(user.subscription.startedAt)}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Renews</dt>
                <dd className="mt-1">{formatDate(user.subscription.renewsAt)}</dd>
              </div>
            </dl>
            <ul className="mt-6 grid gap-2 text-sm text-[var(--muted)]">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link to="/plans" className={`${surfaceBtn} mt-6`}>Change plan</Link>
          </>
        ) : (
          <>
            <h2 id="plan-heading" className="mt-2 font-display text-3xl">No plan yet</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
              Pocket, Parlour, and Balcony are saved on this device. Choosing one does not charge a card.
            </p>
            <Link to="/plans" className={`${primaryBtn} mt-6`}>See plans</Link>
          </>
        )}
      </section>
    </div>
  );
}
