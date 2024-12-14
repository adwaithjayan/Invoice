"use client"

import {HomeIcon, Users2} from "lucide-react";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";

export const dashboardLinks = [
      {
            id: 0,
            name: "Dashboard",
            href: "/dashboard",
            icon: HomeIcon,
      },
      {
            id: 1,
            name: "Invoices",
            href: "/dashboard/invoices",
            icon: Users2,
      },
];


export function DashBordLink(){
      const pathName = usePathname();
      return <>
            {dashboardLinks.map((link) => (
                <Link href={link.href} key={link.id} className={cn(pathName === link.href ? 'text-primary bg-primary/10':'text-muted-foreground hover:text-foreground','flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary')}>
                      <link.icon className='size-4'/>
                      {link.name}
                </Link>
                ))
            }
      </>
}