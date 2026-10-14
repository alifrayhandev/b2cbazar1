import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://b2cbazar.com'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/checkout`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/policies/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/policies/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/policies/delivery`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/policies/returns`, changeFrequency: 'monthly', priority: 0.4 },
  ]
}
