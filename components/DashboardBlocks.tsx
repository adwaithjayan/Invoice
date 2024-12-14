import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Activity, CreditCard, DollarSign, Users} from "lucide-react";
import prisma from "@/utils/db";
import {requireUser} from "@/utils/hooks.";
import {formatCurrency} from "@/utils/currency";

async function getData(userId:string){
      const [data,openInVoices,paidInvoices] = await Promise.all([
          await prisma.invoice.findMany({
                where:{
                      userId:userId,
                },
                select:{
                      total:true,
                },
          }),
          prisma.invoice.findMany({
                where:{
                      userId:userId,
                      status:'PENDING',
                },
                select:{
                      id:true,
                }
          }),
          prisma.invoice.findMany({
                where:{
                      userId:userId,
                      status:'PAID',
                },
                select:{
                      id:true,
                },
          }),
      ]);
      return {data,openInVoices,paidInvoices}
}

async function DashboardBlocks() {
      const session = await requireUser();
      const {data,openInVoices,paidInvoices} = await getData(session.user?.id as string);
      return (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8'>
                <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Total revenue</CardTitle>
                            <DollarSign className='size-4 text-muted-foreground'/>
                      </CardHeader>
                      <CardContent>
                            <h2 className='text-2xl font-bold'>
                                  {formatCurrency({amount:data.reduce((acc,invoice)=>acc+invoice.total,0),currency:'USD'})}
                            </h2>
                            <p className='text-xs text-muted-foreground'>Based on total value</p>
                      </CardContent>
                </Card>
                <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Total Invoices Issued</CardTitle>
                            <Users className='size-4 text-muted-foreground'/>
                      </CardHeader>
                      <CardContent>
                            <h2 className='text-xl font-bold'>+{data.length}</h2>
                            <p className='text-xs text-muted-foreground'>Total Invoices Issued!</p>
                      </CardContent>
                </Card>
                <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Paid Invoices</CardTitle>
                            <CreditCard className='size-4 text-muted-foreground'/>
                      </CardHeader>
                      <CardContent>
                            <h2 className='text-xl font-bold'>+{paidInvoices.length}</h2>
                            <p className='text-xs text-muted-foreground'>Total Invoices which have been paid!</p>
                      </CardContent>
                </Card>
                <Card>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Pending Invoices</CardTitle>
                            <Activity className='size-4 text-muted-foreground'/>
                      </CardHeader>
                      <CardContent>
                            <h2 className='text-xl font-bold'>+{openInVoices.length}</h2>
                            <p className='text-xs text-muted-foreground'>Invoices which are currently pending!</p>
                      </CardContent>
                </Card>
          </div>
      )
}

export default DashboardBlocks