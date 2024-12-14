"use server";

import {requireUser} from "@/utils/hooks.";
import {parseWithZod} from "@conform-to/zod";
import {invoiceSchema, onboardingSchema} from "@/utils/zodSchema";
import prisma from "@/utils/db";
import {redirect} from "next/navigation";
import {emailClient} from "@/utils/mailtrap";
import {formatCurrency} from "@/utils/currency";

export async function onboardUser(prevState:any,formData:FormData) {
      const session = await requireUser();

      const submission = parseWithZod(formData,{
            schema:onboardingSchema,
      });

      if(submission.status !=='success'){
            return submission.reply();
      }

      const data =await prisma.user.update({
            where:{
                  id:session?.user?.id,
            },
            data:{
                  firstName:submission.value.firstName,
                  lastName:submission.value.lastName,
                  address:submission.value.address,
            },
      })

      return redirect('/dashboard');

}

export async function createInvoice(prevState:any,formData:FormData) {
      const session = await requireUser();

      const submission = parseWithZod(formData,{
            schema:invoiceSchema,
      });

      if(submission.status !=='success'){
            return submission.reply();
      }

      const data =await prisma.invoice.create({
            data:{
                  clientAddress: submission.value.clientAddress,
                  clientEmail: submission.value.clientEmail,
                  clientName: submission.value.clientName,
                  currency: submission.value.currency,
                  date: submission.value.date,
                  dueDate: submission.value.dueDate,
                  fromAddress: submission.value.fromAddress,
                  fromEmail: submission.value.fromEmail,
                  fromName: submission.value.fromName,
                  invoiceItemDescription: submission.value.invoiceItemDescription,
                  invoiceItemQuantity: submission.value.invoiceItemQuantity,
                  invoiceItemRate: submission.value.invoiceItemRate,
                  invoiceName: submission.value.invoiceName,
                  invoiceNumber: submission.value.invoiceNumber,
                  status: submission.value.status,
                  total: submission.value.total,
                  note: submission.value.note,
                  userId: session.user?.id,
            },
      });
      const sender = {
            email: "hello@demomailtrap.com",
            name: "Adwaith Jayan",
      };

      await emailClient.send({
            from: sender,
            to: [{email: 'aj007boss@gmail.com'}],
            template_uuid: "f3b3d7f4-db75-459a-b857-7a731de08d57",
            template_variables: {
                  "clientName": submission.value.clientName,
                  "invoiceNumber": submission.value.invoiceNumber,
                  "dueDate": new Intl.DateTimeFormat('en-US',{
                        dateStyle:'long'
                  }).format(new Date(submission.value.dueDate)),
                  "totalAmount": formatCurrency({amount:submission.value.total,currency:submission.value.currency as any}),
                  "invoiceLink":process.env.NODE_ENV !== 'production'?`http://localhost:3000/api/invoice/${data.id}`:`https://invoice-one-kappa.vercel.app/api/invoice/${data.id}`,
            }
      })



      return redirect('/dashboard/invoices');

}

export async function editInvoice(prevState:any,formData:FormData) {
      const session = await requireUser();
      const submission = parseWithZod(formData,{
            schema:invoiceSchema
      });
      if(submission.status !=='success'){
            return submission.reply();
      }
      const data =await prisma.invoice.update({
            where:{
                  id:formData.get('id') as string,
                  userId:session.user?.id
            },
            data:{
                  clientAddress: submission.value.clientAddress,
                  clientEmail: submission.value.clientEmail,
                  clientName: submission.value.clientName,
                  currency: submission.value.currency,
                  date: submission.value.date,
                  dueDate: submission.value.dueDate,
                  fromAddress: submission.value.fromAddress,
                  fromEmail: submission.value.fromEmail,
                  fromName: submission.value.fromName,
                  invoiceItemDescription: submission.value.invoiceItemDescription,
                  invoiceItemQuantity: submission.value.invoiceItemQuantity,
                  invoiceItemRate: submission.value.invoiceItemRate,
                  invoiceName: submission.value.invoiceName,
                  invoiceNumber: submission.value.invoiceNumber,
                  status: submission.value.status,
                  total: submission.value.total,
                  note: submission.value.note,
            },
      })

      const sender = {
            email: "hello@demomailtrap.com",
            name: "Adwaith Jayan",
      };

      await emailClient.send({
            from: sender,
            to: [{email: 'aj007boss@gmail.com'}],
            template_uuid: "96e34365-cce1-473f-a450-4ff83a232a1f",
            template_variables: {
                  "clientName": submission.value.clientName,
                  "invoiceNumber": submission.value.invoiceNumber,
                  "dueDate": new Intl.DateTimeFormat('en-US',{
                        dateStyle:'long'
                  }).format(new Date(submission.value.dueDate)),
                  "totalAmount": formatCurrency({amount:submission.value.total,currency:submission.value.currency as any}),
                  "invoiceLink":process.env.NODE_ENV !=='production'?`http://localhost:3000/api/invoice/${data.id}`:`https://invoice-one-kappa.vercel.app/api/invoice/${data.id}`,
            }
      })
      return redirect('/dashboard/invoices');
}

export async function deleteInvoice(invoiceId:string){
      const session = await requireUser();
      const data =await prisma.invoice.delete({
            where:{
                  id:invoiceId,
                  userId:session.user?.id
            }
      });
      return redirect('/dashboard/invoices');
}

export async function markAsPaid(invoiceId:string){
      const session = await requireUser();
      const data =await prisma.invoice.update({
            where:{
                  userId:session.user?.id,
                  id:invoiceId,
            },
            data:{
                  status:'PAID',
            }
      })

      return redirect('/dashboard/invoices');
}