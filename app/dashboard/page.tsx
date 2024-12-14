import {requireUser} from "@/utils/hooks.";
import DashboardBlocks from "@/components/DashboardBlocks";
import InvoiceGraph from "@/components/invoiceGraph";
import {RecentInvoices} from "@/components/recentInvoices";
import prisma from "@/utils/db";
import {Empty} from "@/components/empty";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";


async function getData(userId:string){
      const data =await prisma.invoice.findMany({
            where:{
                  userId: userId,
            },
            select:{
                  id:true,
            }
      })
      return data
}

async function DashboardPage() {
      const session = await requireUser();
      const data =await getData(session.user?.id as string);

      return (
          <>
                {data.length< 1 ? <Empty title='No invoices found' description='Hey you have&apos;t created any invoice. please create one.' buttonText='Create Invoice' href='/dashboard/invoices/create'/>:
                    <Suspense fallback={<Skeleton className='w-full h-full flex-1'/> }>
                            <DashboardBlocks/>
                            <div className='grid gap-4 lg:grid-cols-3 md:gap-8'>
                                  <InvoiceGraph />
                                  <RecentInvoices/>
                            </div>
                    </Suspense>
          }
          </>
      )
}

export default DashboardPage
