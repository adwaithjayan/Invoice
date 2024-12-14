import React from 'react'
import prisma from "@/utils/db";
import {notFound} from "next/navigation";
import {requireUser} from "@/utils/hooks.";
import {EditInvoice} from "@/components/editInvoice";

async function getData(invoiceId:string,userId:string){
      const data =await prisma.invoice.findUnique({
            where:{
                  id:invoiceId,
                  userId:userId
            }
      });
      if(!data){
            return notFound();
      }
      return data;
}

type Params =Promise<{invoiceId:string}>
async function Page({params}: { params:Params }) {
      const   {invoiceId} = await params;
      const session = await requireUser();
      const data =await getData(invoiceId,session.user?.id as string)
      return (
         <EditInvoice data={data}/>
      )
}

export default Page
