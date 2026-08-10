import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/auth/current-user";
import { regions } from "@/lib/regions";
import { getInitials } from "@/lib/format";
import { logout } from "@/app/actions/auth";
import { getMyLikes, getMyPartnerPage } from "@/lib/ratings/user";
import PartnerPageToggle from "@/components/PartnerPageToggle";

export const metadata: Metadata = {
  title: "Il mio profilo",
  robots: { index: false, follow: false },
};

export default async function ProfiloPage() {
  const user = await getCurrentUserProfile();
  if (!user) redirect("/accedi");

  const region = user.regionSlug
    ? regions.find((r) => r.slug === user.regionSlug)
    : undefined;

  const [myLikes, partnerPage] = await Promise.all([
    getMyLikes(),
    user.userType === "partner" ? getMyPartnerPage(user.id) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-50">
        Il mio profilo
      </p>

      <div className="mt-6 flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-white">
          {getInitials(user.fullName)}
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {user.fullName}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
        </div>
      </div>

      <dl className="mt-10 divide-y divide-black/10 rounded-2xl border border-black/10 dark:divide-white/10 dark:border-white/10">
        <div className="flex items-center justify-between px-5 py-4">
          <dt className="text-sm text-zinc-500 dark:text-zinc-400">Tipo di account</dt>
          <dd className="text-sm font-medium">
            {user.userType === "partner" ? "Partner" : "Viaggiatore"}
          </dd>
        </div>

        {user.userType === "partner" && (
          <>
            <div className="flex items-center justify-between px-5 py-4">
              <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                Regione di riferimento
              </dt>
              <dd className="text-sm font-medium">{region?.name ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <dt className="text-sm text-zinc-500 dark:text-zinc-400">Canale social</dt>
              <dd className="max-w-[60%] truncate text-sm font-medium">
                {user.socialLink ? (
                  <a
                    href={user.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline dark:text-brand-50"
                  >
                    {user.socialLink}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </>
        )}
      </dl>

      {user.userType === "partner" && partnerPage && (
        <section className="mt-10 rounded-2xl border border-black/10 p-6 dark:border-white/10">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            La mia pagina sul portale
          </h2>
          <div className="mt-3">
            <PartnerPageToggle
              active={partnerPage.isActive}
              likes={partnerPage.likes}
            />
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          I miei like
        </h2>
        {myLikes.length > 0 ? (
          <ul className="mt-4 divide-y divide-black/10 rounded-2xl border border-black/10 dark:divide-white/10 dark:border-white/10">
            {myLikes.map((like) => (
              <li
                key={`${like.kind}-${like.name}-${like.createdAt}`}
                className="flex items-center justify-between px-5 py-4"
              >
                <span className="text-sm font-medium">
                  {like.urlPath ? (
                    <Link
                      href={like.urlPath}
                      className="hover:text-brand-600 dark:hover:text-brand-50"
                    >
                      {like.name}
                    </Link>
                  ) : (
                    like.name
                  )}
                </span>
                <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {like.kind}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Non hai ancora messo like. Esplora le regioni e segna quelle che ti
            piacciono.
          </p>
        )}
      </section>

      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="w-full rounded-md border border-zinc-900 py-3 text-base font-medium transition-colors hover:bg-zinc-900 hover:text-white dark:border-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900"
        >
          Esci
        </button>
      </form>
    </div>
  );
}
