"use client"

import { useAuth } from "@/app/hooks/useAuth"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Invite () {
    const pathname = usePathname()
    const redirect = pathname.replace("/","")
    const router = useRouter()
    const {user} = useAuth()

    useEffect(() => {
        if(!user) router.push(`/auth/login?page=${redirect}`)
    },[])
    return (
        <div>invite</div>
    )
}