'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { productSchema, type ProductInput } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import type { Product } from '@/types'

interface Props {
  product?: Product
}

export function ProductForm({ product }: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const isEdit = !!product

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      price: product.price,
      sale_price: product.sale_price ?? undefined,
      stock_quantity: product.stock_quantity,
      category: product.category ?? '',
      image_url: product.image_url ?? '',
      is_featured: product.is_featured,
      is_active: product.is_active,
      is_draft: product.is_draft,
      low_stock_threshold: product.low_stock_threshold,
    } : {
      is_active: true, is_featured: false, is_draft: false, low_stock_threshold: 5, stock_quantity: 0,
    },
  })

  const nameValue = watch('name')

  async function onSubmit(data: ProductInput) {
    setServerError(null)
    const url = isEdit ? `/api/admin/products/${product!.id}` : '/api/admin/products'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) { setServerError(json.error ?? 'Failed to save product.'); return }
    router.push('/admin/products')
    router.refresh()
  }

  const field = (name: keyof ProductInput, label: string, type = 'text', extra?: object) => (
    <div>
      <label className="label">{label}</label>
      <input type={type} className="input" {...register(name, { valueAsNumber: type === 'number' })} {...extra} />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]?.message as string}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      {field('name', 'Product Name *')}
      <div>
        <label className="label">Slug *</label>
        <div className="flex gap-2">
          <input className="input flex-1" {...register('slug')} />
          <button type="button" onClick={() => setValue('slug', slugify(nameValue ?? ''))}
            className="btn-secondary text-xs px-3">Auto</button>
        </div>
        {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
      </div>
      <div>
        <label className="label">Description</label>
        <textarea rows={3} className="input resize-none" {...register('description')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('price', 'Price (৳) *', 'number')}
        {field('sale_price', 'Sale Price (৳)', 'number')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field('stock_quantity', 'Stock Quantity *', 'number')}
        {field('low_stock_threshold', 'Low Stock Alert At', 'number')}
      </div>
      {field('category', 'Category')}
      {field('image_url', 'Image URL')}

      <div className="flex flex-wrap gap-5">
        {(['is_active', 'is_featured', 'is_draft'] as const).map(key => (
          <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" className="accent-navy-600" {...register(key)} />
            {key === 'is_active' ? 'Active' : key === 'is_featured' ? 'Featured' : 'Draft'}
          </label>
        ))}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving…' : isEdit ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
      </div>
    </form>
  )
}
