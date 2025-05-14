import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleOvalLeftEllipsisIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { supportService, SupportTicket } from '../../services/support.service';
import ErrorState from '../common/ErrorState';

interface TicketListProps {
  onSelectTicket?: (ticket: SupportTicket) => void;
  className?: string;
}

const TicketList: React.FC<TicketListProps> = ({ onSelectTicket, className = '' }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supportService.getUserTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load support tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on status
  const filteredTickets = statusFilter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === statusFilter);

  // Status badge component
  const StatusBadge = ({ status }: { status?: string }) => {
    switch(status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="mr-1 h-3 w-3" />
            Open
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ChatBubbleOvalLeftEllipsisIcon className="mr-1 h-3 w-3" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircleIcon className="mr-1 h-3 w-3" />
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  // Formatted date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={fetchTickets}
      />
    );
  }

  if (tickets.length === 0) {
    return (
      <div className={`text-center py-10 ${className}`}>
        <ChatBubbleOvalLeftEllipsisIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No support tickets</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't created any support tickets yet.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Your Support Tickets</h3>
        
        {/* Status filter */}
        <div className="relative inline-block text-left">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-1" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <div 
            key={ticket.id}
            className="border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectTicket && onSelectTicket(ticket)}
          >
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">#{ticket.id}</span>
              <StatusBadge status={ticket.status} />
            </div>
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-1">{ticket.subject}</h4>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{ticket.message}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Created: {formatDate(ticket.createdAt || '')}</span>
                <span>{ticket.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;