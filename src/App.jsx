import { useEffect, useRef, useState } from 'react'
import beans from './data/beans.json'
import supabase from './lib/supabaseClient'

const highlights = [
  {
    title: 'Asal Pilihan',
    description: 'Biji single-origin nusantara disangrai setiap minggu dalam batch kecil untuk menjaga kesegaran puncak.'
  },
  {
    title: 'Rasa Diutamakan',
    description: 'Profil sangrai disusun cermat agar menonjolkan manis alami, aroma bunga, dan rempah tiap terroir.'
  },
  {
    title: 'Ramah Tugas Kuliah',
    description: 'Situs statis sederhana berbasis React + Tailwind sehingga bisa kamu deploy ke mana saja dalam hitungan detik.'
  }
]

const ritualSteps = [
  'Pilih gaya sangrai & ukuran giling favoritmu',
  'Kami menyangrai dan mengemas maksimal 48 jam',
  'Seduh penuh cinta—V60, espresso, atau cold brew'
]

const testimonials = [
  {
    name: 'Rani • Peracik Rumahan',
    quote: 'Biji Kopikir Saja mengubah ritual pagi aku. Lot Gayo manis legit dan cerah—pas banget untuk V60.'
  },
  {
    name: 'Dimas • Pemilik Kafe',
    quote: 'Skor cupping konsisten dan pengiriman super andal. Pelanggan terus minta blend Toraja.'
  }
]

const storyOverview = {
  title: 'Kenapa namanya Kopikir Dulu?',
  body: [
    'Kami bermula dari obrolan tugas kuliah yang berakhir jadi percobaan cupping setiap akhir pekan. Nama “Kopikir Dulu” lahir karena setiap keputusan penting di kampus pasti ditemani kopi segar.',
    'Sekarang kami mengurasi lot mikro dari Aceh sampai Papua, menyangrainya di Bandung, dan berbagi ritual mindful brew ke lebih banyak teman kampus, kafe kecil, dan komunitas kreatif.'
  ],
  cta: {
    label: 'Ngobrol bareng di WhatsApp',
    href: 'https://chat.whatsapp.com/Jpb0C58niUL1s6bPdXHWQA'
  }
}

const storyMilestones = [
  {
    year: '2022',
    title: 'Batch perdana',
    description: 'Mulai menyangrai 3 lot favorit teman satu kelas memakai roaster pinjaman.'
  },
  {
    year: '2023',
    title: 'Komunitas kampus',
    description: 'Membuka sesi cupping keliling kampus dan menyiapkan blend custom untuk acara mahasiswa.'
  },
  {
    year: '2024',
    title: 'Kopikir Dulu marketplace',
    description: 'Merilis situs ini agar siapa pun bisa pesan lot mikro langsung dari koperasi petani.'
  }
]

const WHATSAPP_LINK = 'https://chat.whatsapp.com/Jpb0C58niUL1s6bPdXHWQA'

const resolveBeanImage = (bean) => {
  if (bean?.image) {
    if (bean.image.startsWith('http') || bean.image.startsWith('data:') || bean.image.startsWith('/')) {
      return bean.image
    }
    return `/${bean.image.replace(/^\/+/, '')}`
  }

  return `/img/${bean?.id ?? 'placeholder'}/1.jpg`
}

function SectionTitle({ eyebrow, title, description, theme = 'light' }) {
  const themeStyles = {
    light: {
      eyebrow: 'text-kopi-mid',
      title: 'text-kopi-dark',
      description: 'text-kopi-dark/80'
    },
    dark: {
      eyebrow: 'text-white/70',
      title: 'text-white',
      description: 'text-white/80'
    }
  }

  const styles = themeStyles[theme] ?? themeStyles.light

  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className={`uppercase tracking-[0.3em] text-sm font-semibold ${styles.eyebrow}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl md:text-4xl font-display ${styles.title}`}>{title}</h2>
      <p className={`mt-4 text-base md:text-lg ${styles.description}`}>{description}</p>
    </div>
  )
}

function BeanCard({ bean, isAuthenticated, onAddToCart }) {
  const beanImage = resolveBeanImage(bean)

  return (
    <article className="group bean-card rounded-3xl bg-white shadow-[0_25px_60px_rgba(43,29,18,0.08)] overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(43,29,18,0.12)] max-w-sm mx-auto w-full">
      <div className="relative h-60 overflow-hidden">
        <img
          src={beanImage}
          alt={bean.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 bg-white/90 text-xs font-semibold tracking-[0.2em] px-3 py-1 rounded-full text-kopi-dark">
          {bean.origin}
        </span>
      </div>
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="text-xl font-semibold text-kopi-dark">{bean.name}</h3>
          <p className="mt-2 text-sm text-kopi-dark/70">Catatan rasa:</p>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {bean.notes.map((note) => (
              <li
                key={note}
                className="px-3 py-1 rounded-full bg-kopi-light/70 text-kopi-dark/80"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 justify-between mt-auto">
          <p className="text-2xl font-display text-kopi-mid">
            {bean?.variants?.['200'] ? `Rp${bean.variants['200'].toLocaleString('id-ID')}` : 'Custom Roast'}
          </p>
          <button
            onClick={() => onAddToCart(bean)}
            className="inline-flex items-center gap-1 rounded-full bg-kopi-mid text-white px-3 py-2 text-sm font-semibold shadow-lg shadow-kopi-mid/30 transition hover:bg-kopi-dark"
          >
            {isAuthenticated ? 'Masukkan ke keranjang' : 'Masuk untuk checkout'}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </article>
  )
}

function AuthModal({
  open,
  mode,
  onClose,
  onToggleMode,
  onSubmit,
  form,
  onChange,
  loading,
  error
}) {
  if (!open) return null

  const title = mode === 'signin' ? 'Masuk ke Kopikir Saja' : 'Buat akun baru'
  const cta = mode === 'signin' ? 'Masuk' : 'Daftar'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-[32px] bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          aria-label="Tutup form"
          className="absolute right-6 top-6 text-kopi-dark/60 hover:text-kopi-dark"
          onClick={onClose}
        >
          ×
        </button>
        <p className="uppercase tracking-[0.4em] text-xs text-kopi-mid">{mode === 'signin' ? 'Masuk' : 'Daftar'}</p>
        <h3 className="mt-2 text-2xl font-display text-kopi-dark">{title}</h3>
        <p className="mt-2 text-sm text-kopi-dark/70">
          Gunakan email & password untuk mengakses fitur checkout dan pesananmu.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
              className="mt-2 w-full rounded-2xl border border-kopi-dark/10 px-4 py-3 text-kopi-dark placeholder:text-kopi-dark/40 focus:border-kopi-mid focus:outline-none focus:ring-2 focus:ring-kopi-mid/30"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => onChange('password', e.target.value)}
              className="mt-2 w-full rounded-2xl border border-kopi-dark/10 px-4 py-3 text-kopi-dark placeholder:text-kopi-dark/40 focus:border-kopi-mid focus:outline-none focus:ring-2 focus:ring-kopi-mid/30"
              placeholder="Minimal 6 karakter"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-kopi-mid px-6 py-3 font-semibold text-white shadow-lg shadow-kopi-mid/30 transition hover:bg-kopi-dark disabled:opacity-60"
          >
            {loading ? 'Memproses…' : cta}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-kopi-dark/70">
          {mode === 'signin' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button type="button" onClick={onToggleMode} className="font-semibold text-kopi-mid">
            {mode === 'signin' ? 'Daftar' : 'Masuk'}
          </button>
        </p>
      </div>
    </div>
  )
}

function StatusToast({ message }) {
  if (!message) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 rounded-2xl bg-white px-5 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
      <p className="text-sm font-semibold text-kopi-dark">{message}</p>
    </div>
  )
}

function AddToCartModal({ open, bean, form, onChange, onAdd, onClose }) {
  if (!open || !bean) return null

  const variantEntries = Object.entries(bean.variants ?? {})
  const variantPrice = form.variant ? bean.variants?.[form.variant] ?? 0 : 0
  const subtotal = variantPrice * (Number(form.quantity) || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-lg rounded-[32px] bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-kopi-dark/60 hover:text-kopi-dark"
          aria-label="Tutup pilihan varian"
        >
          ×
        </button>
        <p className="uppercase tracking-[0.4em] text-xs text-kopi-mid">Tambahkan ke keranjang</p>
        <h3 className="mt-2 text-2xl font-display text-kopi-dark">{bean.name}</h3>
        <p className="mt-2 text-sm text-kopi-dark/70">Pilih berat dan jumlah untuk dimasukkan ke keranjangmu.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Berat (gram)</label>
            <select
              required
              value={form.variant}
              onChange={(e) => onChange('variant', e.target.value)}
              className="mt-2 w-full rounded-2xl border border-kopi-dark/10 px-4 py-3 text-kopi-dark focus:border-kopi-mid focus:outline-none focus:ring-2 focus:ring-kopi-mid/30"
            >
              {variantEntries.length === 0 && <option value="">Stok menunggu update</option>}
              {variantEntries.map(([size, price]) => (
                <option key={size} value={size}>
                  {size} g — Rp{price.toLocaleString('id-ID')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Jumlah</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => onChange('quantity', Math.max(1, Number(e.target.value) || 1))}
              className="mt-2 w-full rounded-2xl border border-kopi-dark/10 px-4 py-3 text-kopi-dark focus:border-kopi-mid focus:outline-none focus:ring-2 focus:ring-kopi-mid/30"
            />
          </div>
          <div className="rounded-2xl bg-kopi-light/60 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Subtotal</p>
            <p className="mt-2 text-lg font-semibold text-kopi-dark">{form.variant || '—'} g × {form.quantity}</p>
            <p className="text-2xl font-display text-kopi-mid">
              {subtotal ? `Rp${subtotal.toLocaleString('id-ID')}` : '—'}
            </p>
          </div>
          <button
            type="button"
            disabled={!form.variant || !subtotal}
            onClick={onAdd}
            className="w-full rounded-full bg-kopi-mid px-6 py-3 font-semibold text-white shadow-lg shadow-kopi-mid/30 transition hover:bg-kopi-dark disabled:opacity-60"
          >
            Masukkan ke keranjang
          </button>
        </div>
      </div>
    </div>
  )
}

function CheckoutModal({ open, items, form, onChange, onSubmit, onClose, loading }) {
  if (!open) return null

  const total = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-kopi-dark/60 hover:text-kopi-dark"
          aria-label="Tutup checkout"
        >
          ×
        </button>
        <p className="uppercase tracking-[0.4em] text-xs text-kopi-mid">Checkout</p>
        <h3 className="mt-2 text-2xl font-display text-kopi-dark">Konfirmasi pesanan</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-kopi-light/50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Keranjang</p>
              <ul className="mt-3 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-kopi-dark">{item.beanName}</p>
                      <p className="text-kopi-dark/60">
                        {item.variant} g × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-kopi-mid">
                      Rp{(item.pricePerUnit * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-kopi-dark/10 pt-4">
                <p className="text-sm text-kopi-dark/70">Total sementara</p>
                <p className="text-xl font-display text-kopi-mid">Rp{total.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Nama penerima</label>
              <input
                type="text"
                required
                value={form.recipientName}
                onChange={(e) => onChange('recipientName', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-kopi-dark/10 px-4 py-3 text-kopi-dark focus:border-kopi-mid focus:outline-none focus:ring-2 focus:ring-kopi-mid/30"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Alamat lengkap</label>
              <textarea
                rows="3"
                required
                value={form.address}
                onChange={(e) => onChange('address', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-kopi-dark/10 px-4 py-3 text-kopi-dark focus:border-kopi-mid focus:outline-none focus:ring-2 focus:ring-kopi-mid/30"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Nomor WA</label>
              <input
                type="tel"
                required
                value={form.whatsapp}
                onChange={(e) => onChange('whatsapp', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-kopi-dark/10 px-4 py-3 text-kopi-dark focus:border-kopi-mid focus:outline-none focus:ring-2 focus:ring-kopi-mid/30"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-kopi-dark/60">Catatan</label>
              <textarea
                rows="2"
                value={form.note}
                onChange={(e) => onChange('note', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-kopi-dark/10 px-4 py-3 text-kopi-dark focus:border-kopi-mid focus:outline-none focus:ring-2 focus:ring-kopi-mid/30"
                placeholder="Opsional (mis. grind size)"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !items.length}
              className="w-full rounded-full bg-kopi-mid px-6 py-3 font-semibold text-white shadow-lg shadow-kopi-mid/30 transition hover:bg-kopi-dark disabled:opacity-60"
            >
              {loading ? 'Memproses…' : 'Konfirmasi pesanan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function CartDrawer({ open, items, onClose, onRemove, onCheckout, onQuantityChange, drawerRef, isClosing }) {
  if (!open) return null

  const subtotal = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0)

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div
        ref={drawerRef}
        onClick={(event) => event.stopPropagation()}
        className={`h-full max-h-full w-[78vw] max-w-[420px] overflow-y-auto rounded-l-[32px] bg-white p-5 shadow-2xl sm:w-full sm:max-w-md sm:p-6 lg:max-w-lg cart-drawer-panel ${
          isClosing ? 'cart-drawer-panel--closing' : 'cart-drawer-panel--opening'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-kopi-mid">Keranjang</p>
            <h3 className="mt-2 text-2xl font-display text-kopi-dark">Pesananmu</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-kopi-dark/60 hover:text-kopi-dark transition-colors"
          >
            ×
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-kopi-dark/60">Keranjang masih kosong. Yuk tambah biji favoritmu.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-kopi-dark/10 p-3">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-kopi-light/60">
                    {item.image ? (
                      <img src={item.image} alt={item.beanName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-kopi-dark/50">Foto</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-kopi-dark">{item.beanName}</p>
                    <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-kopi-dark/60">{item.variant} g</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.id, -1)}
                          className="h-7 w-7 rounded-full border border-kopi-dark/20 text-sm font-bold text-kopi-dark transition hover:bg-kopi-light"
                          aria-label={`Kurangi ${item.beanName}`}
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold text-kopi-dark">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.id, 1)}
                          className="h-7 w-7 rounded-full border border-kopi-dark/20 text-sm font-bold text-kopi-dark transition hover:bg-kopi-light"
                          aria-label={`Tambah ${item.beanName}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-kopi-mid">
                      Rp{(item.pricePerUnit * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="text-xs uppercase tracking-[0.2em] text-kopi-dark/60 hover:text-red-500 transition"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="rounded-2xl bg-kopi-light/50 p-4">
            <div className="flex items-center justify-between text-sm text-kopi-dark/70">
              <span>Subtotal</span>
              <span className="text-xl font-display text-kopi-mid">Rp{subtotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCheckout}
            disabled={!items.length}
            className="w-full rounded-full bg-kopi-mid px-6 py-3 font-semibold text-white shadow-lg shadow-kopi-mid/30 transition hover:bg-kopi-dark active:scale-[0.98] disabled:opacity-60"
          >
            Lanjut checkout
          </button>
        </div>
      </div>
    </div>
  )
}

function OrderSummaryCard({ summary }) {
  if (!summary || !summary.items?.length) return null

  return (
    <div className="rounded-[32px] border border-kopi-dark/10 bg-white p-8 shadow-[0_20px_60px_rgba(43,29,18,0.08)]">
      <p className="uppercase tracking-[0.3em] text-xs text-kopi-mid">Pesanan teranyar</p>
      <h3 className="mt-3 text-2xl font-display text-kopi-dark">{summary.items.length} item</h3>
      <ul className="mt-4 space-y-3">
        {summary.items.map((item) => (
          <li key={`${item.beanId}-${item.variant}`} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-semibold text-kopi-dark">{item.beanName}</p>
              <p className="text-kopi-dark/60">{item.variant} g × {item.quantity}</p>
            </div>
            <p className="font-semibold text-kopi-mid">
              Rp{(item.pricePerUnit * item.quantity).toLocaleString('id-ID')}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-kopi-dark/60">Penerima</p>
          <p className="font-semibold text-kopi-dark">{summary.recipientName}</p>
        </div>
        <div>
          <p className="text-sm text-kopi-dark/60">Kontak</p>
          <p className="text-kopi-dark/80">WA: {summary.whatsapp}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-kopi-dark/60">Alamat</p>
          <p className="text-kopi-dark/80 leading-relaxed">{summary.address}</p>
        </div>
      </div>
      {summary.note && (
        <p className="mt-4 text-sm text-kopi-dark/70">
          <span className="font-semibold text-kopi-dark">Catatan:</span> {summary.note}
        </p>
      )}
      <div className="mt-6 flex items-center justify-between border-top border-kopi-dark/10 pt-4">
        <p className="text-sm text-kopi-dark/70">Total keseluruhan</p>
        <p className="text-2xl font-display text-kopi-mid">Rp{summary.total.toLocaleString('id-ID')}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [authMode, setAuthMode] = useState('signin')
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [pendingBean, setPendingBean] = useState(null)
  const [selectedBean, setSelectedBean] = useState(null)
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false)
  const [cartForm, setCartForm] = useState({ variant: '', quantity: 1 })
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState({
    recipientName: '',
    address: '',
    whatsapp: '',
    note: ''
  })
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [lastOrderSummary, setLastOrderSummary] = useState(null)
  const [showAllBeans, setShowAllBeans] = useState(false)
  const [isCartClosing, setIsCartClosing] = useState(false)
  const cartDrawerRef = useRef(null)
  const cartCloseTimeoutRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(''), 4000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    return () => {
      if (cartCloseTimeoutRef.current) {
        clearTimeout(cartCloseTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isCartOpen) return
    const handleClickOutside = (event) => {
      if (cartDrawerRef.current && !cartDrawerRef.current.contains(event.target)) {
        closeCartDrawer()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCartOpen])

  const closeCartDrawer = (options = {}) => {
    if (!isCartOpen) return

    if (options.instant) {
      if (cartCloseTimeoutRef.current) {
        clearTimeout(cartCloseTimeoutRef.current)
        cartCloseTimeoutRef.current = null
      }
      setIsCartClosing(false)
      setIsCartOpen(false)
      return
    }

    if (isCartClosing) return

    setIsCartClosing(true)
    cartCloseTimeoutRef.current = setTimeout(() => {
      setIsCartOpen(false)
      setIsCartClosing(false)
      cartCloseTimeoutRef.current = null
    }, 320)
  }

  const handleAuthFormChange = (field, value) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password
        })
        if (error) throw error
        setToastMessage('Berhasil masuk. Yuk lanjut checkout!')
      } else {
        const { error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password
        })
        if (error) throw error
        setToastMessage('Akun dibuat! Cek email verifikasi bila diminta Supabase.')
      }

      const beanToResume = pendingBean
      setAuthForm({ email: '', password: '' })
      setIsAuthModalOpen(false)
      setPendingBean(null)
      if (beanToResume) {
        handleAddToCartRequest(beanToResume, { skipAuthCheck: true })
      }
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleAddToCartRequest = (bean, options = {}) => {
    if (!session && !options.skipAuthCheck) {
      setPendingBean(bean)
      setAuthMode('signin')
      setIsAuthModalOpen(true)
      return
    }

    const defaultVariant = Object.keys(bean.variants ?? {})[0] ?? ''
    setSelectedBean(bean)
    setCartForm({ variant: defaultVariant, quantity: 1 })
    setIsAddToCartModalOpen(true)
  }

  const handleCartFormChange = (field, value) => {
    setCartForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddCartItem = () => {
    if (!selectedBean || !cartForm.variant) return
    const quantity = Number(cartForm.quantity) || 1
    const pricePerUnit = selectedBean.variants?.[cartForm.variant] ?? 0

    const beanImage = resolveBeanImage(selectedBean)

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.beanId === selectedBean.id && item.variant === cartForm.variant
      )
      if (existingIndex !== -1) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        }
        return updated
      }

      return [
        ...prev,
        {
          id: `${selectedBean.id}-${cartForm.variant}-${Date.now()}`,
          beanId: selectedBean.id,
          beanName: selectedBean.name,
          variant: cartForm.variant,
          pricePerUnit,
          quantity,
          image: beanImage
        }
      ]
    })

    setToastMessage('Ditambahkan ke keranjang!')
    setIsAddToCartModalOpen(false)
    setSelectedBean(null)
    setCartForm({ variant: '', quantity: 1 })
    setIsCartClosing(false)
    setIsCartOpen(true)
  }

  const handleRemoveCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleAdjustCartItemQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + delta)
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleToggleBeansView = () => {
    setShowAllBeans((prev) => {
      const next = !prev
      if (!next && typeof window !== 'undefined') {
        setTimeout(() => {
          const marketplaceSection = document.getElementById('marketplace')
          marketplaceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 60)
      }
      return next
    })
  }

  const handleOpenCheckout = () => {
    if (!cartItems.length) {
      setToastMessage('Keranjang masih kosong.')
      return
    }

    setCheckoutForm({ recipientName: '', address: '', whatsapp: '', note: '' })
    setIsCheckoutModalOpen(true)
    closeCartDrawer({ instant: true })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setCartItems([])
    setToastMessage('Berhasil keluar dari akun.')
    closeCartDrawer({ instant: true })
  }

  const handleCheckoutFormChange = (field, value) => {
    setCheckoutForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault()
    if (!cartItems.length) return
    setCheckoutLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const itemsSnapshot = cartItems.map((item) => ({ ...item }))
      const total = itemsSnapshot.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0)

      setLastOrderSummary({
        items: itemsSnapshot,
        recipientName: checkoutForm.recipientName,
        address: checkoutForm.address,
        whatsapp: checkoutForm.whatsapp,
        note: checkoutForm.note,
        total
      })
      setToastMessage('Pesanan dicatat (placeholder). Kami hubungi via WhatsApp ya!')
      window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')
      setCartItems([])
      setIsCheckoutModalOpen(false)
      setCheckoutForm({ recipientName: '', address: '', whatsapp: '', note: '' })
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false)
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const visibleBeans = showAllBeans ? beans : beans.slice(0, 6)

  const handleCloseAddToCart = () => {
    setIsAddToCartModalOpen(false)
    setSelectedBean(null)
  }

  return (
    <div className="min-h-screen bg-kopi-light text-kopi-dark">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-kopi-dark via-[#3b2619] to-kopi-dark/95 px-4 py-3 sm:px-10 md:px-16 lg:px-24 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur">
        <nav className="flex flex-wrap items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.25em] sm:gap-6 sm:text-sm sm:tracking-[0.4em]">
          <span className="font-display text-xl tracking-tight sm:text-2xl">Kopikir Saja</span>
          <div className="hidden sm:flex gap-8">
            <a href="#marketplace" className="hover:text-kopi-light">
              Pasar Kopi
            </a>
            <a href="#story" className="hover:text-kopi-light">
              Cerita
            </a>
              Kontak
            <a href="#contact" className="hover:text-kopi-light">
            </a>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <a
              href="#ritual"
              className="rounded-full text-transform: capitalize; border border-white/40 px-3 py-1.5 text-[0.6rem] hover:bg-white/10 sm:px-4 sm:py-2 sm:text-xs"
            >
              Panduan Seduh
            </a>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="rounded-full border border-white/40 px-3 py-1.5 text-[0.6rem] flex items-center gap-2 sm:px-4 sm:py-2 sm:text-xs"
            >
              Keranjang
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-kopi-dark">
                {cartCount}
              </span>
            </button>
            {session ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full bg-white/90 px-3 py-1.5 text-[0.6rem] font-semibold text-kopi-dark sm:px-4 sm:py-2 sm:text-xs"
              >
                Keluar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-full bg-white/90 px-3 py-1.5 text-[0.6rem] font-semibold text-kopi-dark sm:px-4 sm:py-2 sm:text-xs"
              >
                Masuk / Daftar
              </button>
            )}
          </div>
        </nav>
      </header>
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-kopi-dark via-[#3b2619] to-kopi-dark opacity-90" />
        <section className="relative z-10 px-6 py-10 sm:px-10 md:px-16 lg:px-24 text-white">
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-8">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em]">
                Sangrai segar • Mikro lot
              </p>
              <div>
                <h1 className="text-4xl md:text-6xl font-display leading-tight">
                  Kopikir Saja
                  <br />
                  Biji Kopi Artisan
                </h1>
                <p className="mt-6 text-lg text-white/80">
                  Rayakan budaya kopi Indonesia dengan sangrai kurasi untuk pagi santai, deadline tugas, hingga jeda di
                  antaranya.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-white/80">
                <div>
                  <p className="text-3xl font-display text-white">24h</p>
                  <p>Sangrai-ke-kirim</p>
                </div>
                <div>
                  <p className="text-3xl font-display text-white">90+</p>
                  <p>Skor cupping</p>
                </div>
                <div>
                  <p className="text-3xl font-display text-white">12</p>
                  <p>Mikro lot</p>
                </div>
              </div>
            </div>
            <div className="rounded-[30px] bg-white/10 p-6 backdrop-blur group">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/img/mainHero.jpg"
                  alt="Barista menuang kopi"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-sm text-white/80">
                Disangrai batch kecil di Bandung, dikirim ke seluruh Indonesia.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-kopi-mid shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Chat via WhatsApp
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <main className="px-6 py-16 sm:px-10 md:px-16 lg:px-24 space-y-20 lg:space-y-24">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] scroll-mt-28 md:scroll-mt-32" id="story">
          <div className="rounded-3xl border border-kopi-dark/10 bg-white p-8 shadow-[0_10px_40px_rgba(43,29,18,0.08)]">
            <p className="text-xs uppercase tracking-[0.4em] text-kopi-mid">Latar Belakang</p>
            <h3 className="mt-3 text-3xl font-display text-kopi-dark">{storyOverview.title}</h3>
            {storyOverview.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-kopi-dark/80 leading-relaxed">
                {paragraph}
              </p>
            ))}
            <a
              href={storyOverview.cta.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-kopi-mid px-6 py-3 text-sm font-semibold text-kopi-mid transition hover:bg-kopi-mid hover:text-white"
            >
              {storyOverview.cta.label}
              <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="rounded-3xl border border-kopi-dark/10 bg-white p-8 shadow-[0_10px_40px_rgba(43,29,18,0.08)]">
            <p className="text-xs uppercase tracking-[0.4em] text-kopi-mid">Tonggak Kopikir</p>
            <ul className="mt-6 space-y-5">
              {storyMilestones.map((milestone) => (
                <li key={milestone.title} className="relative pl-6">
                  <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-kopi-mid" />
                  <p className="text-xs uppercase tracking-[0.3em] text-kopi-mid">{milestone.year}</p>
                  <h4 className="mt-1 text-lg font-semibold text-kopi-dark">{milestone.title}</h4>
                  <p className="text-sm text-kopi-dark/70">{milestone.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-12 scroll-mt-24 md:scroll-mt-28" id="marketplace">
          <div className="rounded-[36px] bg-[#3b2619] text-white p-8 md:p-12 shadow-[0_30px_80px_rgba(43,29,18,0.35)] space-y-10">
            <SectionTitle
              eyebrow="Pasar Kopi"
              title="Biji yang rasanya seperti cerita dari nusantara"
              description="Setiap lot langsung dari koperasi petani, diprofil di Loring Smart Roaster, dan dikemas dalam kantong kompos."
              theme="dark"
            />
            <div className="max-w-6xl mx-auto">
              <div className={`grid gap-8 beans-grid ${showAllBeans ? 'beans-expand' : ''}`}>
                {visibleBeans.map((bean) => (
                  <BeanCard
                    key={bean.id}
                    bean={bean}
                    isAuthenticated={Boolean(session)}
                    onAddToCart={handleAddToCartRequest}
                  />
                ))}
              </div>
            </div>
            {beans.length > 6 && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleToggleBeansView}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  {showAllBeans ? 'Tampilkan lebih sedikit' : 'Tampilkan lainnya'}
                  <span aria-hidden>{showAllBeans ? '↑' : '↓'}</span>
                </button>
              </div>
            )}
          </div>
          <OrderSummaryCard summary={lastOrderSummary} />
        </section>

        <section
          id="ritual"
          className="rounded-[32px] bg-white shadow-[0_30px_80px_rgba(43,29,18,0.12)] p-8 md:p-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr] scroll-mt-28 md:scroll-mt-32"
        >
          <div>
            <SectionTitle
              eyebrow="Ritual Seduh"
              title="Tiga langkah mindful untuk cangkir sempurna"
              description="Bayangkan aroma biji baru digiling memenuhi ruangmu—ikuti ritualnya dan seruput perlahan."
            />
          </div>
          <ol className="space-y-6 text-lg text-kopi-dark/80">
            {ritualSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="mt-1 h-10 w-10 flex items-center justify-center rounded-full bg-kopi-light text-kopi-mid font-bold">
                  {index + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-12">
          <SectionTitle
            eyebrow="Testimoni"
            title="Dicintai brewer rumahan dan kafe kecil"
            description="Catatan asli dari teman-teman yang menyeduh Kopikir Saja tiap pekan."
          />
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimony) => (
              <figure key={testimony.name} className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(43,29,18,0.08)]">
                <blockquote className="text-lg text-kopi-dark/90 leading-relaxed">“{testimony.quote}”</blockquote>
                <figcaption className="mt-4 font-semibold text-kopi-mid">{testimony.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="rounded-[32px] bg-gradient-to-r from-kopi-mid to-[#a87b51] text-white p-10 grid gap-8 lg:grid-cols-2 scroll-mt-28 md:scroll-mt-32"
        >
          <div>
            <p className="uppercase tracking-[0.4em] text-sm">Kemitraan & Kolaborasi</p>
            <h3 className="mt-4 text-3xl font-display">Yuk seduh sesuatu yang bermakna bersama</h3>
            <p className="mt-4 text-white/80">
              Butuh biji untuk kafe pop-up, proyek kreatif, atau acara kampus? Kirim pesan—kita bisa rancang sesi cupping
              atau blend khusus.
            </p>
          </div>
          <form className="space-y-4">
            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-white/70">Nama</label>
              <input
                type="text"
                placeholder="Namamu"
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>
            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-white/70">Email atau IG</label>
              <input
                type="text"
                placeholder="halo@kopikir.com"
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>
            <div>
              <label className="text-sm uppercase tracking-[0.3em] text-white/70">Pesan</label>
              <textarea
                rows="4"
                placeholder="Ceritakan idemu"
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
            </div>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-kopi-mid shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Chat via WhatsApp
              <span aria-hidden>↗</span>
            </a>
          </form>
        </section>
      </main>

      <footer className="px-6 py-12 sm:px-10 md:px-16 lg:px-24 border-t border-kopi-dark/10 text-sm text-kopi-dark/80">
        <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between">
          <p>Kopikir Saja © {new Date().getFullYear()} • Diracik untuk semangat belajar.</p>
          <div className="flex justify-center gap-4">
            <a href="https://instagram.com" className="hover:text-kopi-mid">
              Instagram
            </a>
            <a href="https://wa.me/6281234567890" className="hover:text-kopi-mid">
              WhatsApp
            </a>
            <a href="mailto:hello@kopikir.com" className="hover:text-kopi-mid">
              Email
            </a>
          </div>
        </div>
      </footer>

      <AuthModal
        open={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onToggleMode={() => {
          setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))
          setAuthError('')
        }}
        onSubmit={handleAuthSubmit}
        form={authForm}
        onChange={handleAuthFormChange}
        loading={authLoading}
        error={authError}
        bean={pendingBean}
      />
      <CartDrawer
        open={isCartOpen}
        items={cartItems}
        onClose={closeCartDrawer}
        onRemove={handleRemoveCartItem}
        onCheckout={handleOpenCheckout}
        onQuantityChange={handleAdjustCartItemQuantity}
        drawerRef={cartDrawerRef}
        isClosing={isCartClosing}
      />
      <AddToCartModal
        open={isAddToCartModalOpen}
        bean={selectedBean}
        form={cartForm}
        onChange={handleCartFormChange}
        onAdd={handleAddCartItem}
        onClose={handleCloseAddToCart}
      />
      <CheckoutModal
        open={isCheckoutModalOpen}
        items={cartItems}
        form={checkoutForm}
        onChange={handleCheckoutFormChange}
        onSubmit={handleCheckoutSubmit}
        onClose={handleCloseCheckout}
        loading={checkoutLoading}
      />
      <StatusToast message={toastMessage} />
    </div>
  )
}
