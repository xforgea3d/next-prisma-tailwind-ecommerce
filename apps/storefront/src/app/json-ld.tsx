const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xforgea3d.com'

// ── Organization Schema ──────────────────────────────────────
export function OrganizationJsonLd() {
   const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'xForgea3D',
      url: SITE_URL,
      logo: {
         '@type': 'ImageObject',
         url: `${SITE_URL}/logo.png`,
         width: 512,
         height: 512,
      },
      description:
         "Türkiye'nin premium 3D baskı markası. Yüksek kaliteli figürler, heykeller, dekoratif ürünler ve kişiye özel 3D baskı çözümleri.",
      foundingDate: '2024',
      founders: [{ '@type': 'Person', name: 'xForgea3D Team' }],
      address: {
         '@type': 'PostalAddress',
         addressCountry: 'TR',
         addressLocality: 'Türkiye',
      },
      contactPoint: {
         '@type': 'ContactPoint',
         contactType: 'customer service',
         availableLanguage: ['Turkish', 'English'],
      },
      sameAs: [
         // Social links populated from SiteSettings at runtime if needed
      ],
   }

   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
   )
}

// ── WebSite Schema (with SearchAction) ───────────────────────
export function WebSiteJsonLd() {
   const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'xForgea3D',
      description: 'Premium 3D Baskı Ürünleri',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'tr-TR',
      potentialAction: {
         '@type': 'SearchAction',
         target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
         },
         'query-input': 'required name=search_term_string',
      },
   }

   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
   )
}

// ── LocalBusiness Schema (critical for local SEO) ────────────
export function LocalBusinessJsonLd() {
   const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: 'xForgea3D',
      alternateName: 'xForgea 3D Baskı',
      url: SITE_URL,
      image: `${SITE_URL}/logo.png`,
      description: 'Antalya merkezli profesyonel 3D baskı ve yazıcı hizmetleri. Kişiye özel üretim, araç aksesuarları, figürler, prototipler ve endüstriyel 3D baskı çözümleri.',
      telephone: '+905382880738',
      email: 'info@xforgea3d.com',
      priceRange: '₺₺',
      currenciesAccepted: 'TRY',
      paymentAccepted: 'Kredi Kartı, Banka Kartı, Havale',
      address: {
         '@type': 'PostalAddress',
         streetAddress: 'Muratpaşa',
         addressLocality: 'Antalya',
         addressRegion: 'Antalya',
         postalCode: '07100',
         addressCountry: 'TR',
      },
      geo: {
         '@type': 'GeoCoordinates',
         latitude: 36.8841,
         longitude: 30.7056,
      },
      areaServed: [
         { '@type': 'City', name: 'Antalya' },
         { '@type': 'AdministrativeArea', name: 'Muratpaşa' },
         { '@type': 'AdministrativeArea', name: 'Konyaaltı' },
         { '@type': 'AdministrativeArea', name: 'Kepez' },
         { '@type': 'AdministrativeArea', name: 'Akdeniz Bölgesi' },
         { '@type': 'Country', name: 'Türkiye' },
      ],
      hasOfferCatalog: {
         '@type': 'OfferCatalog',
         name: '3D Baskı Hizmetleri',
         itemListElement: [
            { '@type': 'OfferCatalog', name: 'Kişiye Özel 3D Baskı' },
            { '@type': 'OfferCatalog', name: 'Araç Aksesuarları' },
            { '@type': 'OfferCatalog', name: '3D Figürler ve Heykeller' },
            { '@type': 'OfferCatalog', name: 'Prototip Üretim' },
            { '@type': 'OfferCatalog', name: 'Endüstriyel 3D Baskı' },
         ],
      },
      sameAs: [
         'https://www.instagram.com/xforgea3d/',
      ],
      parentOrganization: { '@id': `${SITE_URL}/#organization` },
   }

   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
   )
}

// ── BreadcrumbList Schema ────────────────────────────────────
interface BreadcrumbItem {
   name: string
   href?: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
   const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
         '@type': 'ListItem',
         position: i + 1,
         name: item.name,
         ...(item.href && { item: item.href.startsWith('/') ? `${SITE_URL}${item.href}` : item.href }),
      })),
   }

   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
   )
}

// ── Product JSON-LD (for product detail pages) ───────────────
interface ProductReviewForJsonLd {
   rating: number
   text: string
   user: { name?: string | null }
   createdAt: Date | string
}

interface ProductForJsonLd {
   id: string
   title: string
   description?: string | null
   images: string[]
   price: number
   discount: number
   stock: number
   isAvailable: boolean
   brand?: { title: string } | null
   productReviews?: ProductReviewForJsonLd[]
}

export function productJsonLd(product: ProductForJsonLd) {
   const finalPrice = product.price - product.discount
   const reviews = product.productReviews ?? []
   const hasReviews = reviews.length > 0

   const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description ?? product.title,
      image: product.images,
      url: `${SITE_URL}/products/${product.id}`,
      brand: {
         '@type': 'Brand',
         name: product.brand?.title ?? 'xForgea3D',
      },
      offers: {
         '@type': 'Offer',
         url: `${SITE_URL}/products/${product.id}`,
         priceCurrency: 'TRY',
         price: finalPrice.toFixed(2),
         ...(product.discount > 0 && {
            priceValidUntil: new Date(
               Date.now() + 30 * 24 * 60 * 60 * 1000
            )
               .toISOString()
               .slice(0, 10),
         }),
         availability: product.isAvailable && product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
         seller: { '@id': `${SITE_URL}/#organization` },
         itemCondition: 'https://schema.org/NewCondition',
      },
      ...(product.discount > 0 && {
         additionalProperty: {
            '@type': 'PropertyValue',
            name: 'originalPrice',
            value: product.price.toFixed(2),
         },
      }),
   }

   if (hasReviews) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
      const avgRating = Math.round((totalRating / reviews.length) * 10) / 10

      schema.aggregateRating = {
         '@type': 'AggregateRating',
         ratingValue: avgRating.toString(),
         reviewCount: reviews.length.toString(),
         bestRating: '5',
         worstRating: '1',
      }

      schema.review = reviews.map((r) => ({
         '@type': 'Review',
         reviewRating: {
            '@type': 'Rating',
            ratingValue: r.rating.toString(),
            bestRating: '5',
            worstRating: '1',
         },
         author: {
            '@type': 'Person',
            name: r.user.name ?? 'Anonim',
         },
         reviewBody: r.text,
         datePublished: new Date(r.createdAt).toISOString().slice(0, 10),
      }))
   }

   return schema
}

// ── Product JSON-LD Component ────────────────────────────────
export function ProductJsonLd({ product }: { product: ProductForJsonLd }) {
   const schema = productJsonLd(product)
   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
   )
}

// ── Blog JSON-LD (for blog post pages) ───────────────────────
interface BlogPostForJsonLd {
   slug: string
   title_tr: string
   excerpt_tr?: string | null
   body_html_tr?: string | null
   cover_image_url?: string | null
   published_at?: Date | null
   tags: string[]
   seo_description_tr?: string | null
}

export function blogJsonLd(post: BlogPostForJsonLd) {
   const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title_tr,
      description: post.seo_description_tr ?? post.excerpt_tr ?? post.title_tr,
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(post.cover_image_url && { image: post.cover_image_url }),
      datePublished: post.published_at
         ? new Date(post.published_at).toISOString()
         : undefined,
      dateModified: post.published_at
         ? new Date(post.published_at).toISOString()
         : undefined,
      author: {
         '@type': 'Organization',
         name: 'xForgea3D',
         url: SITE_URL,
      },
      publisher: {
         '@id': `${SITE_URL}/#organization`,
      },
      mainEntityOfPage: {
         '@type': 'WebPage',
         '@id': `${SITE_URL}/blog/${post.slug}`,
      },
      inLanguage: 'tr-TR',
      keywords: post.tags.join(', '),
   }

   return schema
}

// ── Blog JSON-LD Component ───────────────────────────────────
export function BlogPostJsonLd({ post }: { post: BlogPostForJsonLd }) {
   const schema = blogJsonLd(post)
   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
   )
}
