import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllResources, getResourceBySlug } from '@/lib/resources'
import { PurchaseCTA } from '@/components/build/PurchaseCTA'
import { JsonLd } from '@/components/seo/JsonLd'

type Params = { slug: string }
type SearchParams = { success?: string }

export async function generateStaticParams(): Promise<Params[]> {
  const all = await getAllResources()
  return all.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const resource = await getResourceBySlug(params.slug)
  if (!resource) return { title: 'Not found' }
  return {
    title: resource.title,
    description: resource.description,
    alternates: { canonical: `https://build.bnzo.io/${resource.slug}` },
    openGraph: {
      title: resource.title,
      description: resource.description,
      url: `https://build.bnzo.io/${resource.slug}`,
      siteName: 'bnzo Build',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: resource.title,
      description: resource.description,
    },
  }
}

export default async function ResourceDetailPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const resource = await getResourceBySlug(params.slug)
  if (!resource) notFound()

  const purchased = searchParams.success === 'true'
  const isFree = resource.tier === 'free'

  const productSchema = resource.tier === 'paid'
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: resource.title,
        description: resource.description,
        url: `https://build.bnzo.io/${resource.slug}`,
        brand: {
          '@type': 'Organization',
          name: 'Bnzo Studio',
          url: 'https://bnzo.io',
        },
        offers: {
          '@type': 'Offer',
          price: (resource.price / 100).toFixed(2),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://build.bnzo.io/${resource.slug}`,
        },
      }
    : null

  return (
    <article className="mx-auto max-w-content px-6 py-20">
      {productSchema ? <JsonLd schema={productSchema} /> : null}
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-wider text-slate hover:text-ink"
      >
        ← All resources
      </Link>

      <header className="mt-8 border-b border-slate/20 pb-12">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate">
          <span>{isFree ? 'Free' : 'Premium'}</span>
          {resource.tags.map((tag) => (
            <span key={tag}>
              <span aria-hidden="true" className="mr-2">
                ·
              </span>
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-6 font-geist text-5xl font-bold leading-[0.95] tracking-tighter md:text-6xl">
          {resource.title}
        </h1>
        <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-ink/75">
          {resource.description}
        </p>
      </header>

      {purchased ? (
        <div className="mt-10 rounded-lg border border-lime-deep bg-lime-deep/10 p-6">
          <div className="font-mono text-xs uppercase tracking-wider text-ink">
            Purchase complete
          </div>
          <p className="mt-2 font-sans text-ink">
            Thanks. Check your email for access details.
          </p>
          {resource.downloadUrl ? (
            <a
              href={resource.downloadUrl}
              className="mt-4 inline-block font-mono text-sm text-ink underline underline-offset-4 hover:text-ink/70"
            >
              Download now →
            </a>
          ) : (
            <p className="mt-3 font-mono text-xs text-ink/70">
              Download link coming shortly.
            </p>
          )}
        </div>
      ) : null}

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="prose-invert max-w-prose font-sans text-base leading-relaxed text-ink/85">
          <h2 className="mb-4 font-geist text-2xl font-bold tracking-tight text-ink">
            What it is
          </h2>
          <p className="whitespace-pre-line">{resource.content}</p>
          <h2 className="mb-4 mt-10 font-geist text-2xl font-bold tracking-tight text-ink">
            Who it's for
          </h2>
          <p>
            Builders wiring multi-agent, multi-domain products. Skip the
            scaffolding. Start from tested patterns.
          </p>
        </div>

        <div>
          {isFree ? (
            <aside className="sticky top-8 rounded-lg border border-slate/30 bg-chalk p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-slate">
                Free download
              </div>
              <div className="mt-2 font-geist text-4xl font-bold tracking-tight text-ink">
                Free
              </div>
              <p className="mt-4 text-sm text-ink/70">
                No sign-up. No paywall. Grab it.
              </p>
              {resource.downloadUrl ? (
                <a
                  href={resource.downloadUrl}
                  className="mt-6 block w-full rounded-md bg-ink px-6 py-3 text-center font-sans font-medium text-chalk transition-opacity duration-fast hover:opacity-90"
                >
                  Download
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 w-full rounded-md bg-slate/30 px-6 py-3 font-sans text-ink/50"
                >
                  Coming soon
                </button>
              )}
            </aside>
          ) : (
            <PurchaseCTA resource={resource} />
          )}
        </div>
      </div>
    </article>
  )
}

