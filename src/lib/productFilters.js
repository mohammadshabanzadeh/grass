// منطق خالصِ فیلتر محصولات — جدا از کامپوننت تا هم در صفحه‌ی محصولات و هم
// در تست‌ها با همان کد کار کنیم.

/**
 * گروه‌های فیلتر را از روی ویژگی‌های واقعی محصولات می‌سازد.
 * (رنگ، جنس، اندازه و هر ویژگی دیگری که در ووکامرس تعریف شده باشد.)
 * اگر ویژگی‌ای تعریف نشده باشد، گروهی هم ساخته نمی‌شود تا فیلترِ بی‌اثر
 * به کاربر نشان داده نشود.
 */
export function buildAttrGroups(products) {
  const map = new Map()
  products.forEach((p) =>
    (p.attributes || []).forEach((a) => {
      if (!a?.name || !a.values?.length) return
      if (!map.has(a.name)) map.set(a.name, new Set())
      a.values.forEach((v) => map.get(a.name).add(v))
    }),
  )
  return [...map.entries()].map(([name, values]) => ({ name, values: [...values] }))
}

/**
 * برای هر دسته، فهرست خودش + همه‌ی زیرشاخه‌ها (در هر عمقی).
 * در ووکامرس محصولات همیشه اسلاگ والد را ندارند، پس انتخاب یک والد باید
 * محصولات زیرشاخه‌ها را هم بیاورد.
 */
export function buildCatExpansion(catTree) {
  const map = {}
  const walk = (node) => {
    const slugs = [node.slug]
    ;(node.children || []).forEach((child) => {
      walk(child)
      slugs.push(...(map[child.slug] || [child.slug]))
    })
    map[node.slug] = slugs
    return slugs
  }
  catTree.forEach(walk)
  return map
}

/**
 * اعمال همه‌ی فیلترها.
 * - دسته‌ها: محصول باید در یکی از دسته‌های انتخاب‌شده (یا زیرشاخه‌هایشان) باشد.
 * - ویژگی‌ها: در هر گروه، محصول باید حداقل یکی از مقادیر انتخاب‌شده را داشته
 *   باشد؛ و همه‌ی گروه‌های انتخاب‌شده باید برقرار باشند (AND بین گروه‌ها،
 *   OR داخل هر گروه).
 */
export function filterProducts(products, { cats = [], catExpansion = {}, attrSel = {}, height } = {}) {
  const wanted = new Set(cats.flatMap((s) => catExpansion[s] || [s]))
  const selectedAttrs = Object.entries(attrSel).filter(([, v]) => v?.length)

  return products.filter((p) => {
    const catOk = cats.length === 0 || (p.catSlugs || []).some((s) => wanted.has(s))

    const attrOk = selectedAttrs.every(([name, values]) => {
      const attr = (p.attributes || []).find((a) => a.name === name)
      return attr && attr.values.some((v) => values.includes(v))
    })

    const heightOk =
      !height?.active || (typeof p.height === 'number' && p.height >= height.min && p.height <= height.max)

    return catOk && attrOk && heightOk
  })
}
