import apiService from './api.service';

export interface SupportTicket {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// API endpoints
const SUPPORT_ENDPOINT = '/support';
const TICKETS_ENDPOINT = `${SUPPORT_ENDPOINT}/tickets`;
const FAQ_ENDPOINT = `${SUPPORT_ENDPOINT}/faq`;
const KNOWLEDGE_BASE_ENDPOINT = `${SUPPORT_ENDPOINT}/kb`;

export const supportService = {
  // Submit a new support ticket
  async createTicket(ticketData: Omit<SupportTicket, 'id' | 'userId' | 'status' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> {
    try {
      const response = await apiService.post<{status: string, data: SupportTicket}>(TICKETS_ENDPOINT, ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      // Mock response for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock support ticket creation in development');
        return {
          id: 'mock-ticket-' + Date.now(),
          userId: 'current-user',
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...ticketData
        };
      }
      throw error;
    }
  },

  // Get user's support tickets
  async getUserTickets(): Promise<SupportTicket[]> {
    try {
      const response = await apiService.get<{status: string, data: SupportTicket[]}>(TICKETS_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      // Mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock support tickets in development');
        return [
          {
            id: 'ticket-1',
            userId: 'current-user',
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Help with campaign setup',
            message: 'I need assistance setting up my first campaign. The system shows an error when I try to save it.',
            status: 'open',
            category: 'Campaigns',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 'ticket-2',
            userId: 'current-user',
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Billing question',
            message: 'I was charged twice for my subscription this month. Could you please help me resolve this?',
            status: 'in_progress',
            category: 'Billing',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          }
        ];
      }
      throw error;
    }
  },

  // Get a specific ticket
  async getTicket(ticketId: string): Promise<SupportTicket> {
    try {
      const response = await apiService.get<{status: string, data: SupportTicket}>(`${TICKETS_ENDPOINT}/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket ${ticketId}:`, error);
      throw error;
    }
  },

  // Update an existing ticket (add comments, change status, etc.)
  async updateTicket(ticketId: string, updateData: Partial<SupportTicket>): Promise<SupportTicket> {
    try {
      const response = await apiService.patch<{status: string, data: SupportTicket}>(`${TICKETS_ENDPOINT}/${ticketId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ticket ${ticketId}:`, error);
      throw error;
    }
  },

  // Get all FAQs
  async getFAQs(category?: string): Promise<FAQItem[]> {
    try {
      const endpoint = category ? `${FAQ_ENDPOINT}?category=${category}` : FAQ_ENDPOINT;
      const response = await apiService.get<{status: string, data: FAQItem[]}>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock FAQs in development');
        return [
          {
            id: 'faq-1',
            question: 'How do I set up my LinkedIn profile?',
            answer: 'Go to the Profile page from the sidebar menu, then click "Create Profile" or "Edit Profile" to set up your LinkedIn information. You\'ll need to provide your LinkedIn URL and basic profile information.',
            category: 'Getting Started',
            order: 1
          },
          {
            id: 'faq-2',
            question: 'How do I import leads from LinkedIn?',
            answer: 'Use the LinkedIn Scraper tool available in the sidebar. Enter search criteria or LinkedIn profile URLs to import leads. You can then manage them in the Leads section.',
            category: 'Leads',
            order: 2
          },
          {
            id: 'faq-3',
            question: 'How do I create a messaging campaign?',
            answer: 'Navigate to the Campaigns page, click "Create Campaign", set your target audience, write your message templates, and set the campaign schedule. You can use AI assistance to help craft personalized messages.',
            category: 'Campaigns',
            order: 3
          }
        ].filter(faq => !category || faq.category === category);
      }
      throw error;
    }
  },

  // Get knowledge base articles
  async getKnowledgeBaseArticles(category?: string, tag?: string): Promise<KnowledgeBaseArticle[]> {
    try {
      let endpoint = KNOWLEDGE_BASE_ENDPOINT;
      if (category || tag) {
        endpoint += '?';
        if (category) endpoint += `category=${category}&`;
        if (tag) endpoint += `tag=${tag}`;
        endpoint = endpoint.replace(/[&?]$/, ''); // Remove trailing & or ?
      }
      
      const response = await apiService.get<{status: string, data: KnowledgeBaseArticle[]}>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching knowledge base articles:', error);
      // Mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock knowledge base articles in development');
        return [
          {
            id: 'kb-1',
            title: 'Getting Started with LinkPilot',
            content: 'A comprehensive guide to setting up your account and configuring your LinkedIn profile...',
            category: 'Getting Started',
            tags: ['setup', 'beginners'],
            createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
            updatedAt: new Date(Date.now() - 1296000000).toISOString() // 15 days ago
          },
          {
            id: 'kb-2',
            title: 'Advanced Campaign Strategies',
            content: 'Learn how to create highly targeted campaigns that deliver results...',
            category: 'Campaigns',
            tags: ['advanced', 'best-practices'],
            createdAt: new Date(Date.now() - 1728000000).toISOString(), // 20 days ago
            updatedAt: new Date(Date.now() - 864000000).toISOString() // 10 days ago
          },
          {
            id: 'kb-3',
            title: 'Troubleshooting Connection Issues',
            content: 'If you\'re having trouble connecting to LinkedIn, try these steps...',
            category: 'Troubleshooting',
            tags: ['linkedin', 'connections'],
            createdAt: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
            updatedAt: new Date(Date.now() - 432000000).toISOString() // 5 days ago
          }
        ].filter(article => 
          (!category || article.category === category) && 
          (!tag || article.tags.includes(tag))
        );
      }
      throw error;
    }
  },

  // Get a specific knowledge base article
  async getKnowledgeBaseArticle(articleId: string): Promise<KnowledgeBaseArticle> {
    try {
      const response = await apiService.get<{status: string, data: KnowledgeBaseArticle}>(`${KNOWLEDGE_BASE_ENDPOINT}/${articleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching knowledge base article ${articleId}:`, error);
      throw error;
    }
  }
};

export default supportService;