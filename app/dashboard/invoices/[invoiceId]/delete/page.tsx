import React from 'react'
import prisma from "@/utils/db";
import {redirect} from "next/navigation";
import {requireUser} from "@/utils/hooks.";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import Warn from '@/public/warning-gif.gif'
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import {deleteInvoice} from "@/actions/action";

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

type Params =Promise<{invoiceId:string}>

async function Page({params} : { params:Params }) {
      const session = await requireUser()
      const {invoiceId} =await params;
      await Authorized(invoiceId,session.user?.id as string);
      return (
          <div className='flex flex-1 justify-center items-center'>
                <Card className='max-w-[500px]'>
                      <CardHeader>
                            <CardTitle>Delete Invoice</CardTitle>
                            <CardDescription>Are you sure that you want to delete this invoice</CardDescription>
                      </CardHeader>
                      <CardContent>
                            <Image src={Warn} alt='Warning gif' className='rounded-lg'/>
                      </CardContent>
                      <CardFooter className='flex items-center justify-between'>
                            <Link className={buttonVariants(
                                {
                                      variant: 'secondary'
                                }
                            )} href='/dashboard/invoices'>Cancel</Link>
                            <form action={async ()=>{
                                  "use server"
                                  await deleteInvoice(invoiceId);
                            }}>
                                  <SubmitButton variant='destructive' text='Delete Invoice' />
                            </form>
                      </CardFooter>
                </Card>
          </div>
      )
}

export default Page
