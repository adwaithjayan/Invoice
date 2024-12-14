import {requireUser} from "@/utils/hooks.";
import prisma from "@/utils/db";
import {NextResponse} from "next/server";
import {emailClient} from "@/utils/mailtrap";


export async function POST(request:Request,{params}:{params:Promise<{invoiceId:string}>}) {
     try{
           const session = await requireUser();

           const { invoiceId } =await params;

           const invoiceData = await prisma.invoice.findUnique({
                 where:{
                       id:invoiceId,
                       userId:session.user?.id
                 },
           });
           if(!invoiceData){
                 return NextResponse.json({error:"Invoice not found"},{status:404});
           }

           const sender = {
                 email: "hello@demomailtrap.com",
                 name: "Adwaith Jayan",
           };

           await emailClient.send({
                 from: sender,
                 to: [{email: 'aj007boss@gmail.com'}],
                 template_uuid: "3b7513a3-783b-414c-8d84-448ebfc5c1ea",
                 template_variables: {
                       "first_name":invoiceData.clientName
                 }
           })
           return NextResponse.json({success:true});

     }
     catch (error){
           return NextResponse.json({error:"Failed to send reminder"},{status:500});
     }
}