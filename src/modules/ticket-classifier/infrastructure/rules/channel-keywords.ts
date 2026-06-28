import { TicketChannel, TicketPriority } from '@/shared/domain/ticket/ticket.enums';
export const CHANNEL_KEYWORDS: Record<TicketChannel, string[]> = {
  ombudsman: ['denúncia', 'fraude', 'assédio', 'corrupção', 'discriminação'],
  customer_service: ['cancelar', 'assinatura', 'cadastro', 'entrega', 'dúvida'],
  technical_support: ['erro', 'bug', 'login', 'acesso', 'lentidão', 'indisponível'],
  finance: ['cobrança', 'pagamento', 'pix', 'boleto', 'reembolso', 'estorno'],
  out_of_scope: ['bom dia', 'boa tarde', 'olá'],
};
