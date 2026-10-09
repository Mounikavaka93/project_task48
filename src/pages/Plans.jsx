import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { planPrice, plans } from "../data/plans";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatInr } from "../utils/format";
import { pagePad, primaryBtn, surfaceBtn } from "../utils/styles";

export default function Plans() {
  usePageTitle("Plans");
  const { user, subscribe } = useAuth();
  const { notify } = useLibrary();
  const navigate = useNavigate();
  const [cycle, setCycle] = useState(user?.subscription?.cycle || "month");
  const currentId = user?.subscription?.planId || "";

  const choose = (plan) => {
    if (!user) {
      navigate("/signup", { state: { from: "/plans", planId: plan.id, cycle } });
      return;
    }
    const result = subscribe(plan.id, cycle);
    if (!result.ok) return;
    notify(`${plan.name} is your plan. Nothing was charged.`);
    navigate("/account");
  };

  return (
    <div className={`${pagePad} pb-16 pt-24 sm:pt-28`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-copper-700 dark:text-copper-300">Subscription</p>
      <h1 className="mt-2 max-w-2xl font-display text-4xl sm:text-5xl">Pick a seat</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
        Three ways to watch Wickmere. Plans are saved in this browser. No card is charged.
      </p>

      <div className="mt-6 inline-flex rounded-full border border-[var(--line)] bg-[var(--bg-elev)] p-1" role="group" aria-label="Billing period">
        {[
          { id: "month", label: "Monthly" },
          { id: "year", label: "Yearly" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={cycle === item.id}
            onClick={() => setCycle(item.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              cycle === item.id ? "bg-copper-400 text-ink-950" : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {cycle === "year" && <p className="mt-3 text-sm text-tide-500">Yearly billing is two months free.</p>}

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = planPrice(plan, cycle);
          const active = currentId === plan.id && user?.subscription?.cycle === cycle;
          return (
            <article
              key={plan.id}
              className={`flex flex-col rounded-3xl border p-6 ${
                plan.featured
                  ? "border-copper-400 bg-[var(--bg-elev)] shadow-glow"
                  : "border-[var(--line)] bg-[var(--bg-elev)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-3xl">{plan.name}</h2>
                {plan.featured && (
                  <span className="rounded-full bg-copper-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-950">
                    Most chosen
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{plan.tagline}</p>
              <p className="mt-5 font-display text-4xl">
                {formatInr(price)}
                <span className="ml-1 font-sans text-sm font-medium text-[var(--muted)]">/ {cycle === "year" ? "year" : "month"}</span>
              </p>
              <ul className="mt-5 grid flex-1 gap-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-copper-500" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={active}
                onClick={() => choose(plan)}
                className={`${plan.featured ? primaryBtn : surfaceBtn} mt-6 w-full`}
              >
                {active ? "Current plan" : user ? `Switch to ${plan.name}` : `Choose ${plan.name}`}
              </button>
            </article>
          );
        })}
      </div>

      <section className="mt-12" aria-labelledby="compare-heading">
        <h2 id="compare-heading" className="font-display text-3xl">What each seat includes</h2>
        <div className="mt-4 overflow-x-auto rounded-3xl border border-[var(--line)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[var(--bg-elev)] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Detail</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-4 py-3 font-semibold text-[var(--text)]">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Price / month", plans.map((plan) => formatInr(plan.monthly))],
                ["Price / year", plans.map((plan) => formatInr(plan.yearly))],
                ["Screens", ["1", "2", "4"]],
                ["Picture", ["HD", "Full HD", "4K where available"]],
                ["Devices", ["Phone, tablet", "Phone, tablet, TV", "Phone, tablet, laptop, TV"]],
                ["Promos", ["Short promos", "None", "None"]],
                ["Catalog", ["All three cinemas", "All three cinemas", "All three cinemas"]],
              ].map(([label, cells]) => (
                <tr key={label} className="border-t border-[var(--line)]">
                  <th className="px-4 py-3 font-medium">{label}</th>
                  {cells.map((cell, index) => (
                    <td key={plans[index].id} className="px-4 py-3 text-[var(--muted)]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--muted)]">
          Changing plans takes effect on this browser immediately. Renewal dates are shown on your account. Cancel by switching plans or signing out of this demo — there is no payment to stop.
        </p>
      </section>
    </div>
  );
}
