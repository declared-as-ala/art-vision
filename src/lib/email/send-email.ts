import "server-only";
import prisma from "@/lib/prisma";
import { createTransporter } from "./transporter";
import type { StoredEmailPayload } from "./types";

function safeError(error: unknown) { const message=error instanceof Error?error.message:"Échec SMTP"; if(message==="SMTP_NOT_CONFIGURED") return "SMTP non configuré"; if(/auth|credential|password|535/i.test(message)) return "Authentification SMTP refusée"; if(/timeout|timed out|ETIMEDOUT/i.test(message)) return "Délai de connexion SMTP dépassé"; if(/ECONNREFUSED/i.test(message)) return "Connexion SMTP refusée"; return "Échec temporaire de l’envoi SMTP"; }
export async function deliverEmail(logId: string, payload?: StoredEmailPayload) {
  const log=await prisma.emailLog.findUnique({where:{id:logId}}); if(!log) throw new Error("EMAIL_LOG_NOT_FOUND");
  const data=payload || JSON.parse(log.payloadJson) as StoredEmailPayload;
  try { const settings=await prisma.emailSettings.findUnique({where:{id:"default"}}); const senderName=settings?.senderName||process.env.MAIL_FROM_NAME||"Art Vision"; const senderEmail=settings?.senderEmail||process.env.MAIL_FROM_EMAIL||"contact@art-visions.fr"; const info=await createTransporter().sendMail({from:{name:senderName,address:senderEmail},to:data.to,subject:data.subject,html:data.html,text:data.text,replyTo:data.replyTo}); await prisma.emailLog.update({where:{id:logId},data:{status:"SENT",providerMessageId:info.messageId,errorMessageSafe:null,sentAt:new Date(),attemptCount:{increment:1}}}); console.info(`[email] sent log=${logId} type=${log.type}`); return {success:true,messageId:info.messageId}; }
  catch(error){const summary=safeError(error);await prisma.emailLog.update({where:{id:logId},data:{status:"FAILED",errorMessageSafe:summary,attemptCount:{increment:1}}});console.error(`[email] failed log=${logId} type=${log.type}: ${summary}`);return {success:false,error:summary};}
}
export async function queueEmail(input:{type:string;payload:StoredEmailPayload;relatedEntityType?:string;relatedEntityId?:string}) { const log=await prisma.emailLog.create({data:{type:input.type,recipient:input.payload.to.join(", "),subject:input.payload.subject,relatedEntityType:input.relatedEntityType,relatedEntityId:input.relatedEntityId,payloadJson:JSON.stringify(input.payload),status:"PENDING"}}); return deliverEmail(log.id,input.payload); }
export async function retryEmail(logId:string){await prisma.emailLog.update({where:{id:logId},data:{status:"PENDING",errorMessageSafe:null}});return deliverEmail(logId);}