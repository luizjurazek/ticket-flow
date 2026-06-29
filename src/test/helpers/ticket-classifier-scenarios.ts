import { ITicketClassification } from '@/shared/domain/ticket/ticket-classification.interface';
import { TicketChannel, TicketPriority } from '@/shared/domain/ticket/ticket.enums';

export interface TicketClassifierScenario {
  message: string;
  classification: ITicketClassification;
}

export const ticketClassifierScenarios: TicketClassifierScenario[] = [
  {
    message: 'Não consigo acessar minha conta.',
    classification: {
      channel: TicketChannel.TECHNICAL_SUPPORT,
      priority: TicketPriority.HIGH,
      manuallyReview: false,
    },
  },
  {
    message: 'Gostaria de cancelar minha assinatura.',
    classification: {
      channel: TicketChannel.CUSTOMER_SERVICE,
      priority: TicketPriority.MEDIUM,
      manuallyReview: false,
    },
  },
  {
    message: 'Fui cobrado duas vezes no cartão.',
    classification: {
      channel: TicketChannel.FINANCE,
      priority: TicketPriority.MEDIUM,
      manuallyReview: false,
    },
  },
  {
    message: 'Quero denunciar um funcionário por assédio.',
    classification: {
      channel: TicketChannel.OMBUDSMAN,
      priority: TicketPriority.HIGH,
      manuallyReview: false,
    },
  },
  {
    message: 'Bom dia.',
    classification: {
      channel: TicketChannel.OUT_OF_SCOPE,
      priority: TicketPriority.LOW,
      manuallyReview: true,
    },
  },
  {
    message: 'Não consigo acessar minha conta e também fui cobrado duas vezes.',
    classification: {
      channel: TicketChannel.TECHNICAL_SUPPORT,
      priority: TicketPriority.HIGH,
      manuallyReview: true,
    },
  },
  {
    message: 'Quero denunciar um funcionário porque ele me cobrou um valor indevido.',
    classification: {
      channel: TicketChannel.OMBUDSMAN,
      priority: TicketPriority.HIGH,
      manuallyReview: true,
    },
  },
];
