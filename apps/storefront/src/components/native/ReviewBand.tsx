'use client'

const snippets = [
  'beklediğimden çok daha kaliteli',
  'herkes soruyor nerden aldın diye',
  'ürün gerçekten kaliteli',
  'paketleme de gayet özenli',
  'tam oturdu süper kalite',
  'işçilik olarak kusursuz',
  'detaylar harika',
  'tekrar alırım',
  'çok beğenildi',
  '3d yazıcıdan çıktığına inanmıyosun',
]

export default function ReviewBand() {
  // Double for seamless loop
  const items = [...snippets, ...snippets]

  return (
    <div className="w-full overflow-hidden bg-orange-500/5 dark:bg-orange-500/10 py-3 border-y border-orange-500/10">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-3 px-4 py-1.5 rounded-full bg-background border border-orange-500/20 text-xs font-medium text-muted-foreground whitespace-nowrap"
          >
            <span className="text-orange-500 mr-1.5">★</span>
            {text}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
