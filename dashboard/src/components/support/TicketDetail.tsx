import React, { useState } from 'react';
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { SupportTicket } from '../../services/support.service';

interface TicketDetailProps {
  ticket: SupportTicket;
  onBack: () => void;
}

// Mock message history - in a real app, this would come from the backend
interface Message {
  id: string;
  ticketId: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: string;
}

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    ticketId: 'ticket-1',
    content: 'I need assistance setting up my first campaign. The system shows an error when I try to save it.',
    sender: 'user',
    timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'msg-2',
    ticketId: 'ticket-1',
    content: 'Thanks for reaching out! Could you please tell me what error message you\'re seeing when trying to save the campaign?',
    sender: 'support',
    timestamp: new Date(Date.now() - 82800000).toISOString() // 23 hours ago
  },
  {
    id: 'msg-3',
    ticketId: 'ticket-1',
    content: 'I\'m getting a "Failed to save campaign" error with a red banner at the top. I\'ve filled out all the required fields.',
    sender: 'user',
    timestamp: new Date(Date.now() - 79200000).toISOString() // 22 hours ago
  },
  {
    id: 'msg-4',
    ticketId: 'ticket-1',
    content: 'I\'ll look into this for you right away. Could you please share a screenshot of the error? Also, which browser and device are you using?',
    sender: 'support',
    timestamp: new Date(Date.now() - 75600000).toISOString() // 21 hours ago
  },
  {
    id: 'msg-5',
    ticketId: 'ticket-2',
    content: 'I was charged twice for my subscription this month. Could you please help me resolve this?',
    sender: 'user',
    timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: 'msg-6',
    ticketId: 'ticket-2',
    content: 'I apologize for the inconvenience. I\'ve checked your account and confirmed the double charge. We\'ll issue a refund for the duplicate charge within 3-5 business days.',
    sender: 'support',
    timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get messages for this ticket
  const messages = mockMessages.filter(msg => msg.ticketId === ticket.id);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    
    // In a real app, you would send this to your backend
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setNewMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="mr-3 inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{ticket.subject}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Ticket #{ticket.id} • {ticket.status}
            </p>
          </div>
        </div>
        <div>
          <span className="inline-flex rounded-md shadow-sm">
            {ticket.status !== 'closed' && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Close Ticket
              </button>
            )}
          </span>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{ticket.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{ticket.email}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(ticket.createdAt || '')}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1 text-sm text-gray-900">{ticket.category || 'General'}</dd>
          </div>
        </dl>
      </div>

      {/* Message History */}
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <h4 className="text-base font-medium text-gray-900 mb-4">Message History</h4>
        
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {formatDate(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <ChatBubbleOvalLeftEllipsisIcon className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No messages yet</p>
          </div>
        )}

        {/* Reply Form */}
        {ticket.status !== 'closed' && (
          <form onSubmit={handleSendMessage} className="mt-6">
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                placeholder="Type your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newMessage.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="-ml-1 mr-2 h-4 w-4" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;