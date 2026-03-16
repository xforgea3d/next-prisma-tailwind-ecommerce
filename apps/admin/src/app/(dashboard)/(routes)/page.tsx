export const revalidate = 0

import { getGraphRevenue } from '@/actions/get-graph-revenue'
import { getSalesCount } from '@/actions/get-sales-count'
import { getStockCount } from '@/actions/get-stock-count'
import { getTotalRevenue } from '@/actions/get-total-revenue'
import { Overview } from '@/components/overview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { formatter } from '@/lib/utils'
import prisma from '@/lib/prisma'
import {
   Activity, AlertTriangle, CheckCircle2, ClipboardList, CreditCard,
   Database, FileText, Package, PlusCircle, Server, ShoppingCart, TrendingUp,
   Users, XCircle,
} from 'lucide-react'
import Link from 'next/link'

async function getSystemHealth() {
   try {
      const start = Date.now()
      const [
         errorCount,
         pendingOrders,
         pendingQuotes,
         pendingReturns,
         totalUsers,
         totalProducts,
         totalOrders,
         lowStockProducts,
      ] = await Promise.all([
         prisma.error.count({ where: { resolved: false, severity: { in: ['critical', 'high'] } } }),
         prisma.order.count({ where: { status: 'OnayBekleniyor', isPaid: true } }),
         prisma.quoteRequest.count({ where: { status: 'Pending' } }),
         prisma.returnRequest.count({ where: { status: 'Pending' } }),
         prisma.profile.count({ where: { role: 'customer' } }),
         prisma.product.count({ where: { id: { not: 'quote-request-product' } } }),
         prisma.order.count(),
         prisma.product.count({ where: { stock: { lte: 5 }, isAvailable: true, id: { not: 'quote-request-product' } } }),
      ])
      const dbLatency = Date.now() - start

      return {
         dbLatency,
         errorCount,
         pendingOrders,
         pendingQuotes,
         pendingReturns,
         totalUsers,
         totalProducts,
         totalOrders,
         lowStockProducts,
         dbStatus: dbLatency < 3000 ? 'healthy' : dbLatency < 5000 ? 'slow' : 'critical',
      }
   } catch {
      return {
         dbLatency: -1,
         errorCount: -1,
         pendingOrders: 0,
         pendingQuotes: 0,
         pendingReturns: 0,
         totalUsers: 0,
         totalProducts: 0,
         totalOrders: 0,
         lowStockProducts: 0,
         dbStatus: 'down' as const,
      }
   }
}

export default async function DashboardPage() {
   const [totalRevenue, graphRevenue, salesCount, stockCount, health] = await Promise.all([
      getTotalRevenue(),
      getGraphRevenue(),
      getSalesCount(),
      getStockCount(),
      getSystemHealth(),
   ])

   const statusColor = {
      healthy: 'text-emerald-500',
      slow: 'text-yellow-500',
      critical: 'text-red-500',
      down: 'text-red-500',
   }
   const statusText = {
      healthy: 'Sağlıklı',
      slow: 'Yavaş',
      critical: 'Kritik',
      down: 'Bağlantı Yok',
   }

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-4">
            <Heading title="Kontrol Paneli" description="Mağaza genel bakışı" />
            <Separator />

            {/* Revenue + Sales + Stock */}
            <div className="grid gap-4 grid-cols-3">
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
                     <TrendingUp className="h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">Satışlar</CardTitle>
                     <CreditCard className="h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">+{salesCount}</div>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">Stokta Ürün</CardTitle>
                     <Package className="h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stockCount}</div>
                  </CardContent>
               </Card>
            </div>

            {/* System Health Card */}
            <Card>
               <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                     <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Sistem Sağlığı
                     </CardTitle>
                     <div className={`flex items-center gap-1.5 text-sm font-semibold ${statusColor[health.dbStatus]}`}>
                        {health.dbStatus === 'healthy' ? (
                           <CheckCircle2 className="h-4 w-4" />
                        ) : health.dbStatus === 'down' ? (
                           <XCircle className="h-4 w-4" />
                        ) : (
                           <AlertTriangle className="h-4 w-4" />
                        )}
                        {statusText[health.dbStatus]}
                     </div>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {/* DB Latency */}
                     <div className="rounded-lg border p-3 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <Database className="h-3.5 w-3.5" />
                           Veritabanı
                        </div>
                        <div className={`text-lg font-bold ${health.dbLatency < 1000 ? 'text-emerald-500' : health.dbLatency < 3000 ? 'text-yellow-500' : 'text-red-500'}`}>
                           {health.dbLatency > 0 ? `${health.dbLatency}ms` : 'Bağlantı Yok'}
                        </div>
                     </div>

                     {/* Error Count */}
                     <div className="rounded-lg border p-3 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <AlertTriangle className="h-3.5 w-3.5" />
                           Hatalar
                        </div>
                        <div className={`text-lg font-bold ${health.errorCount === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                           {health.errorCount >= 0 ? health.errorCount : '?'}
                        </div>
                        {health.errorCount > 0 && (
                           <Link href="/error-logs" className="text-xs text-red-500 hover:underline">
                              İncele →
                           </Link>
                        )}
                     </div>

                     {/* Total Users */}
                     <div className="rounded-lg border p-3 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <Users className="h-3.5 w-3.5" />
                           Kullanıcılar
                        </div>
                        <div className="text-lg font-bold">{health.totalUsers}</div>
                     </div>

                     {/* Low Stock */}
                     <div className="rounded-lg border p-3 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                           <Package className="h-3.5 w-3.5" />
                           Düşük Stok
                        </div>
                        <div className={`text-lg font-bold ${health.lowStockProducts === 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                           {health.lowStockProducts}
                        </div>
                        {health.lowStockProducts > 0 && (
                           <Link href="/products" className="text-xs text-orange-500 hover:underline">
                              Ürünleri gör →
                           </Link>
                        )}
                     </div>
                  </div>

                  {/* Pending Actions */}
                  {(health.pendingOrders > 0 || health.pendingQuotes > 0 || health.pendingReturns > 0) && (
                     <div className="mt-4 flex flex-wrap gap-2">
                        {health.pendingOrders > 0 && (
                           <Link href="/orders">
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                                 <ShoppingCart className="h-3 w-3" />
                                 {health.pendingOrders} bekleyen sipariş
                              </div>
                           </Link>
                        )}
                        {health.pendingQuotes > 0 && (
                           <Link href="/quote-requests">
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-400">
                                 <ClipboardList className="h-3 w-3" />
                                 {health.pendingQuotes} bekleyen talep
                              </div>
                           </Link>
                        )}
                        {health.pendingReturns > 0 && (
                           <Link href="/returns">
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-400">
                                 <Package className="h-3 w-3" />
                                 {health.pendingReturns} bekleyen iade
                              </div>
                           </Link>
                        )}
                     </div>
                  )}
               </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="col-span-4">
               <CardHeader>
                  <CardTitle>Genel Bakış</CardTitle>
               </CardHeader>
               <CardContent className="pl-2">
                  <Overview data={graphRevenue} />
               </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
               <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                     <Link href="/products/new">
                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                           <PlusCircle className="h-5 w-5" />
                           <span className="text-sm">Yeni Ürün Ekle</span>
                        </Button>
                     </Link>
                     <Link href="/orders">
                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                           <ShoppingCart className="h-5 w-5" />
                           <span className="text-sm">Siparişleri Gör</span>
                        </Button>
                     </Link>
                     <Link href="/quote-requests">
                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                           <ClipboardList className="h-5 w-5" />
                           <span className="text-sm">Bekleyen Talepler</span>
                        </Button>
                     </Link>
                     <Link href="/content/blog/new">
                        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                           <FileText className="h-5 w-5" />
                           <span className="text-sm">Blog Yazısı Ekle</span>
                        </Button>
                     </Link>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   )
}
