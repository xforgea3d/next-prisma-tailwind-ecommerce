'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Loader, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
   const [username, setUsername] = React.useState('')
   const [password, setPassword] = React.useState('')
   const [showPassword, setShowPassword] = React.useState(false)
   const [isLoading, setIsLoading] = React.useState<boolean>(false)
   const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
   const router = useRouter()
   const supabase = createClient()

   async function onSubmit(e: React.FormEvent) {
      e.preventDefault()
      setIsLoading(true)
      setErrorMsg(null)

      try {
         // Eğer "admin" girilirse arkada emaile çevirelim (Supabase Auth email ister)
         const email = username.toLowerCase() === 'admin' ? 'admin@xforgea3d.com' : username

         // 1. Giriş yapmayı dene
         let { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
         })

         // 2. Eğer kullanıcı yoksa (Invalid login credentials) ve admin girilmişse otomatik kayıt yap
         if (error && error.message.includes('Invalid login credentials') && username.toLowerCase() === 'admin') {
            const { error: signUpError } = await supabase.auth.signUp({
               email,
               password,
               options: {
                  data: { name: 'Admin' }
               }
            })

            if (signUpError) {
               setErrorMsg('Kayıt başarısız: ' + signUpError.message)
               setIsLoading(false)
               return
            }

            // Kayıt başarılı olduysa tekrar giriş yapmayı dene
            const retry = await supabase.auth.signInWithPassword({ email, password })
            data = retry.data
            error = retry.error
         }

         if (error) {
            setErrorMsg('Giriş başarısız: ' + error.message)
         } else if (data.session) {
            router.push('/')
            router.refresh()
         }
      } catch (error: any) {
         setErrorMsg('Bir hata oluştu.')
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className={cn('grid gap-6', className)} {...props}>
         <form onSubmit={onSubmit}>
            <div className="grid gap-4">
               <div className="grid gap-1">
                  <Label className="text-sm font-light text-foreground/60" htmlFor="username">
                     Kullanıcı Adı veya E-posta
                  </Label>
                  <Input
                     id="username"
                     placeholder="admin"
                     type="text"
                     autoCapitalize="none"
                     autoCorrect="off"
                     disabled={isLoading}
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                  />
               </div>

               <div className="grid gap-1">
                  <Label className="text-sm font-light text-foreground/60" htmlFor="password">
                     Şifre
                  </Label>
                  <div className="relative">
                     <Input
                        id="password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                     />
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                     >
                        {showPassword ? (
                           <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                           <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                           {showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                        </span>
                     </Button>
                  </div>
               </div>

               {errorMsg && (
                  <div className="text-sm font-medium text-destructive">
                     {errorMsg}
                  </div>
               )}

               <Button disabled={isLoading || !username || !password}>
                  {isLoading && <Loader className="mr-2 h-4 animate-spin" />}
                  Giriş Yap
               </Button>
            </div>
         </form>

         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">
                  Güvenli Giriş
               </span>
            </div>
         </div>
      </div>
   )
}
