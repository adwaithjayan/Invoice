"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {useActionState, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import {createInvoice} from "@/actions/action";
import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {invoiceSchema} from "@/utils/zodSchema";
import {formatCurrency} from "@/utils/currency";


interface InvoiceProps {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
}

export function CreateInvoice({address,firstName,lastName,email}: InvoiceProps) {

      const [selectedDate, setSelectedDate] = useState(new Date());
      const [rate, setRate] = useState("");
      const [quantity, setQuantity] = useState("");
      const [sign, setSign] = useState("USD")

      const calculateTotal =(Number(quantity) || 0) *(Number(rate) ||0);

      const [lastResult,action] = useActionState(createInvoice,undefined);
      const [form,fields] = useForm({
            lastResult,
            onValidate({formData}){
                  return parseWithZod(formData,{
                        schema:invoiceSchema,
                  });
            },
            shouldValidate:'onBlur',
            shouldRevalidate:'onInput',
      })

      return <>
            <Card className='w-full max-w-4xl mx-auto'>
                  <CardContent className='p-6'>
                        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
                              <input type='hidden' name={fields.date.name} value={selectedDate.toISOString()}/>
                              <input type='hidden' name={fields.total.name} value={calculateTotal} />
                        <div className='flex flex-col gap-1 w-fit mb-6'>
                              <div className='flex items-center gap-4'>
                                    <Badge variant='secondary'>Draft</Badge>
                                    <Input placeholder='test' name={fields.invoiceName.name} key={fields.invoiceName.key} defaultValue={fields.invoiceName.initialValue}/>

                              </div>
                              <p className='text-sm text-red-500'>{fields.invoiceName.errors}</p>
                        </div>
                        <div className='grid md:grid-cols-3 gap-6 mb-6'>
                              <div>
                                    <Label>Invoice No.</Label>
                                    <div className='flex'>
                                          <span
                                              className='px-3 border border-r-0 rounded-l-md bg-muted flex items-center'>#</span>
                                          <Input className='rounded-l-none' placeholder='123'
                                                 name={fields.invoiceNumber.name} key={fields.invoiceNumber.key}
                                                 defaultValue={fields.invoiceNumber.initialValue}/>
                                    </div>
                                    <p className='text-sm text-red-500'>{fields.invoiceNumber.errors}</p>

                              </div>
                              <div>
                                    <Label>Currency</Label>
                                    <Select defaultValue='USD' onValueChange={(value)=>setSign(value)}  name={fields.currency.name} key={fields.currency.key}>
                                          <SelectTrigger>
                                                <SelectValue placeholder='Select Currency'/>
                                          </SelectTrigger>
                                          <SelectContent>
                                                <SelectItem value='USD'>United State Dollar -- USD</SelectItem>
                                                <SelectItem value='EUR'>Euro -- EUR</SelectItem>
                                          </SelectContent>
                                    </Select>
                                    <p className='text-sm text-red-500'>{fields.currency.errors}</p>

                              </div>
                        </div>
                              <div className='grid md:grid-cols-2 gap-6 mb-6'>
                              <div>
                                    <Label>From</Label>
                                    <div className='space-y-2'>
                                          <Input placeholder='Your Name' defaultValue={firstName+" "+lastName} name={fields.fromName.name}
                                                 key={fields.fromName.key}/>
                                          <p className='text-sm text-red-500'>{fields.fromName.errors}</p>

                                          <Input placeholder='Your Email' defaultValue={email} name={fields.fromEmail.name}
                                                 key={fields.fromEmail.key}/>
                                          <p className='text-sm text-red-500'>{fields.fromEmail.errors}</p>

                                          <Input placeholder='Your Address' defaultValue={address} name={fields.fromAddress.name}
                                                 key={fields.fromAddress.key}/>
                                          <p className='text-sm text-red-500'>{fields.fromAddress.errors}</p>

                                    </div>
                              </div>
                                    <div>
                                    <Label>To</Label>
                                          <div className='space-y-2'>
                                                <Input placeholder='Client Name' name={fields.clientName.name} defaultValue={fields.clientName.initialValue}
                                                       key={fields.clientName.key}/>
                                                <p className='text-sm text-red-500'>{fields.clientName.errors}</p>

                                                <Input placeholder='Client Email' name={fields.clientEmail.name} defaultValue={fields.clientEmail.initialValue}
                                                       key={fields.clientEmail.key}/>
                                                <p className='text-sm text-red-500'>{fields.clientEmail.errors}</p>

                                                <Input placeholder='Client Address' name={fields.clientAddress.name} defaultValue={fields.clientAddress.initialValue}
                                                       key={fields.clientAddress.key}/>
                                                <p className='text-sm text-red-500'>{fields.clientAddress.errors}</p>

                                          </div>
                                    </div>
                              </div>
                              <div className='grid md:grid-cols-2 gap-6 mb-6'>
                              <div>
                                    <div>
                                          <Label>Date</Label>
                                    </div>
                                    <Popover>
                                          <PopoverTrigger asChild>
                                                <Button variant='outline' className='w-[280px] text-left justify-start'>
                                                      <CalendarIcon/>
                                                      {selectedDate ? new Intl.DateTimeFormat('en-US',{
                                                            dateStyle:'long',
                                                      }).format(selectedDate):<span>Pick a Date</span>}
                                                </Button>
                                          </PopoverTrigger>
                                          <PopoverContent>
                                                <Calendar mode='single' fromDate={new Date()} selected={selectedDate} onSelect={(date)=>setSelectedDate(date || new Date())}/>
                                          </PopoverContent>
                                    </Popover>
                                    <p className='text-red-500 text-sm'>{fields.date.errors}</p>
                              </div>
                                    <div>
                                          <Label>Invoice Due</Label>
                                          <Select name={fields.dueDate.name} defaultValue={fields.dueDate.initialValue}
                                                  key={fields.dueDate.key}>
                                                <SelectTrigger>
                                                      <SelectValue placeholder='Select due date'/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                      <SelectItem value='0'>Due on Receipt</SelectItem>
                                                      <SelectItem value='15'>Net 15</SelectItem>
                                                      <SelectItem value='30'>Net 30</SelectItem>
                                                </SelectContent>
                                          </Select>
                                          <p className='text-red-500 text-sm'>{fields.dueDate.errors}</p>

                                    </div>
                              </div>
                              <div>
                                    <div className='grid grid-cols-12 gap-4 mb-2 font-medium'>
                                    <p className='col-span-6'>Description</p>
                                    <p className='col-span-2'>Quantity</p>
                                    <p className='col-span-2'>Rate</p>
                                    <p className='col-span-2'>Amount</p>
                              </div>
                              <div className='grid grid-cols-12 gap-4 mb-4'>
                                    <div className='col-span-6'>
                                          <Textarea name={fields.invoiceItemDescription.name}
                                                    defaultValue={fields.invoiceItemDescription.initialValue}
                                                    key={fields.invoiceItemDescription.key}
                                                    placeholder='Item name & description'/>
                                          <p className='text-red-500 text-sm'>{fields.invoiceItemDescription.errors}</p>

                                    </div>
                                    <div className='col-span-2'>
                                          <Input placeholder='0' type='number' name={fields.invoiceItemQuantity.name}
                                                 key={fields.invoiceItemQuantity.key} value={quantity} onChange={(e)=>setQuantity(e.target.value)}/>
                                          <p className='text-red-500 text-sm'>{fields.invoiceItemQuantity.errors}</p>

                                    </div>
                                    <div className='col-span-2'>
                                          <Input placeholder='0' type='number' name={fields.invoiceItemRate.name}
                                                 key={fields.invoiceItemRate.key} value={rate} onChange={(e)=>setRate(e.target.value)}/>
                                          <p className='text-red-500 text-sm'>{fields.invoiceItemRate.errors}</p>

                                    </div>
                                    <div className='col-span-2'>
                                          <Input  disabled value={formatCurrency({amount:calculateTotal,currency:sign as any})}/>
                                    </div>
                              </div>
                        </div>
                        <div className='flex justify-end'>
                              <div className='w-1/3'>
                                    <div className='flex justify-between py-2'>
                                          <span>Subtotal</span>
                                          <span>{formatCurrency({amount:calculateTotal,currency:sign as any})}</span>
                                    </div>
                                    <div className='flex justify-between py-2 border-t'>
                                          <span>Total ({sign})</span>
                                          <span className='font-medium underline underline-offset-2'>{formatCurrency({amount:calculateTotal,currency:sign as any})}</span>
                                    </div>
                              </div>
                        </div>
                              <div>
                                    <Label>Note</Label>
                                    <Textarea placeholder='Add your Note/s right here...' name={fields.note.name}
                                              key={fields.note.key} defaultValue={fields.note.initialValue}/>
                                    <p className='text-red-500 text-sm'>{fields.note.errors}</p>

                              </div>
                              <div className='flex items-center justify-end mt-6'>
                                    <div>
                                    <SubmitButton text='Send Invoice to Client'/>
                              </div>
                        </div>
                        </form>
                  </CardContent>
            </Card>
      </>
}