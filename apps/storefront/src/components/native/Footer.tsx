import { Separator } from '@/components/native/separator'
import config from '@/config/site'
import { InstagramIcon, TwitterIcon } from 'lucide-react'
import Link from 'next/link'

const data = [
   {
      label: 'YASAL',
      links: [
         {
            label: 'Mesafeli Satış Sözleşmesi',
            url: '/policies/mesafeli-satis-sozlesmesi',
         },
         {
            label: 'İade Koşulları',
            url: '/policies/iade-kosullari',
         },
         {
            label: 'Gizlilik Politikası',
            url: '/policies/gizlilik-ve-cerez-politikasi',
         },
         {
            label: 'KVKK Aydınlatma Metni',
            url: '/policies/kvkk-aydinlatma-metni',
         },
      ],
   },
   {
      label: 'KAYNAKLAR',
      links: [
         {
            label: 'Blog',
            url: '/blog',
         },
         {
            label: 'Hakkımızda',
            url: '/about',
         },
         {
            label: 'İletişim',
            url: '/contact',
         },
      ],
   },
   {
      label: 'DESTEK',
      links: [
         {
            label: 'S.S.S.',
            url: '/faq',
         },
         {
            label: 'Kargo Takibi',
            url: '/shipping',
         },
      ],
   },
]

export default function Footer() {
   return (
      <footer className="w-full">
         <Separator className="my-12" />
         <div className="flex justify-between px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
            <Trademark />
            <Links />
         </div>
         <Separator className="mt-8 mb-6" />
         <Socials />
      </footer>
   )
}

function Links() {
   return (
      <div className="text-end justify-evenly grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
         {data.map(({ label, links }) => (
            <div key={label}>
               <h2 className="mb-3 text-sm uppercase">{label}</h2>
               <ul className="block space-y-1">
                  {links.map(({ label, url }) => (
                     <li key={label}>
                        <Link
                           href={url}
                           prefetch={true}
                           className="text-sm transition duration-300 text-muted-foreground hover:text-foreground"
                        >
                           {label}
                        </Link>
                     </li>
                  ))}
               </ul>
            </div>
         ))}
      </div>
   )
}

function Trademark() {
   return (
      <div className="mb-6 hidden md:mb-0 md:block">
         <span className="flex flex-col">
            <h2 className="whitespace-nowrap text-sm font-semibold uppercase">
               {config.name}
            </h2>
            <span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 italic">
               Tasarım. Hassasiyet. xForgea3D.
            </span>
            <span className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
               © {new Date().getFullYear()} {config.name}™ . Tüm Hakları Saklıdır.
            </span>
         </span>
      </div>
   )
}

function Socials() {
   return (
      <div className="mb-6 flex justify-center space-x-6 text-muted-foreground">
         <a
            href="https://instagram.com/xforgea3d"
            target="_blank"
            rel="noreferrer"
         >
            <InstagramIcon className="h-4" />
            <span className="sr-only">Instagram sayfası</span>
         </a>
         <a
            href="https://twitter.com/xforgea3d"
            target="_blank"
            rel="noreferrer"
         >
            <TwitterIcon className="h-4" />
            <span className="sr-only">Twitter sayfası</span>
         </a>
      </div>
   )
}
