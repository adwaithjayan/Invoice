import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import Gif from '@/public/paid-gif.gif'
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import {markAsPaid} from "@/actions/action";
import prisma from "@/utils/db";
import {redirect} from "next/navigation";
import {requireUser} from "@/utils/hooks.";

async function Authorized(invoiceId:string,userId:string){
      const data =await prisma.invoice.findUnique({
            where:{
                  id:invoiceId,
                  userId:userId,
            },
      });
      if(!data){
            return redirect('/dashboard/invoices');
      }

}

type Params= Promise<{invoiceId :string}>

async function Page({params}:{ params:Params }) {
      const {invoiceId} =await params;
      const session = await requireUser()
      await Authorized(invoiceId,session.user?.id as string);

      return (
          <div className='flex flex-1 justify-center items-center'>

                <Card className='max-w-[500px]'>
                      <CardHeader>
                            <CardTitle>Mark as Paid</CardTitle>
                            <CardDescription>Are you want to mark this invoice as paid?</CardDescription>
                      </CardHeader>
                      <CardContent>
                            <Image src={Gif} alt='Paid Gif' className='rounded-lg'/>
                      </CardContent>
                      <CardFooter className='flex items-center justify-between'>
                            <Link className={buttonVariants({variant: 'outline'})} href='/dashboard/invoices'>Cancel</Link>
                            <form action={async ()=>{
                                  "use server"
                                 await markAsPaid(invoiceId)
                            }}>
                                  <SubmitButton text='Mark as Paid!'/>
                            </form>
                      </CardFooter>
                </Card>
          </div>
      )
}

export default Page
