import React, { useState, useEffect } from 'react';
import { 
  QuestionMarkCircleIcon, 
  DocumentTextIcon, 
  InboxIcon, 
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import TicketList from '../components/support/TicketList';
import TicketDetail from '../components/support/TicketDetail';
import KnowledgeBaseList from '../components/support/KnowledgeBaseList';
import KnowledgeBaseArticle from '../components/support/KnowledgeBaseArticle';
import { SupportTicket, KnowledgeBaseArticle as ArticleType, supportService } from '../services/support.service';

// FAQ data
const faqs = [
  {
    question: "How do I set up my LinkedIn profile?",
    answer: "Go to the Profile page from the sidebar menu, then click 'Create Profile' or 'Edit Profile' to set up your LinkedIn information. You'll need to provide your LinkedIn URL and basic profile information."
  },
  {
    question: "How do I import leads from LinkedIn?",
    answer: "Use the LinkedIn Scraper tool available in the sidebar. Enter search criteria or LinkedIn profile URLs to import leads. You can then manage them in the Leads section."
  },
  {
    question: "How do I create a messaging campaign?",
    answer: "Navigate to the Campaigns page, click 'Create Campaign', set your target audience, write your message templates, and set the campaign schedule. You can use AI assistance to help craft personalized messages."
  },
  {
    question: "How do I use the AI message generator?",
    answer: "When composing messages, click the 'AI Assist' button to generate personalized message content based on your lead's profile information. You can provide prompts or select templates to guide the AI."
  },
  {
    question: "Is my LinkedIn account information secure?",
    answer: "Yes, we use industry-standard encryption and security practices. Your login credentials are never stored directly, and we use secure OAuth protocols for authentication when available."
  },
  {
    question: "How do I track the performance of my campaigns?",
    answer: "Visit the Analytics page to see detailed metrics on your campaigns, including open rates, response rates, connection acceptance, and more. You can filter by date range and campaign."
  }
];

// Support categories
const supportCategories = [
  {
    name: "Getting Started",
    description: "New user guides and basic setup instructions",
    icon: DocumentTextIcon,
    href: "#getting-started"
  },
  {
    name: "Account & Billing",
    description: "Subscription management and payment information",
    icon: InboxIcon,
    href: "#account-billing"
  },
  {
    name: "Campaign Management",
    description: "How to create and optimize your outreach campaigns",
    icon: ChatBubbleLeftRightIcon,
    href: "#campaigns"
  }
];

const Support: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<{[key: number]: boolean}>({});
  const [activeView, setActiveView] = useState<'main' | 'tickets' | 'ticketDetail' | 'knowledgeBase' | 'articleDetail'>('main');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call - in a real app, you would send this to your backend
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting support request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Handle ticket selection
  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setActiveView('ticketDetail');
  };

  // Go back to the tickets list
  const handleBackToTickets = () => {
    setActiveView('tickets');
    setSelectedTicket(null);
  };

  // Go back to main view
  const handleBackToMain = () => {
    setActiveView('main');
    setSelectedTicket(null);
    setSelectedArticle(null);
    setSelectedCategory('');
  };

  // Handle selecting a knowledge base category
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setActiveView('knowledgeBase');
  };

  // Handle selecting a knowledge base article
  const handleSelectArticle = async (article: ArticleType) => {
    setSelectedArticle(article);
    setActiveView('articleDetail');
    
    // Fetch related articles
    try {
      // In a real app, you'd have an API endpoint for this
      // For now, we'll just filter articles with same category or tags
      const articles = await supportService.getKnowledgeBaseArticles();
      const related = articles
        .filter(a => a.id !== article.id) // Exclude the current article
        .filter(a => 
          a.category === article.category || 
          a.tags.some(tag => article.tags.includes(tag))
        )
        .slice(0, 3); // Limit to top 3 related articles
      
      setRelatedArticles(related);
    } catch (error) {
      console.error('Error fetching related articles:', error);
      setRelatedArticles([]);
    }
  };

  // Go back to knowledge base list
  const handleBackToKnowledgeBase = () => {
    setActiveView('knowledgeBase');
    setSelectedArticle(null);
  };

  // Render view based on active state
  const renderView = () => {
    if (activeView === 'articleDetail' && selectedArticle) {
      return (
        <KnowledgeBaseArticle 
          article={selectedArticle} 
          relatedArticles={relatedArticles}
          onBack={handleBackToKnowledgeBase}
          onSelectArticle={handleSelectArticle}
        />
      );
    }

    if (activeView === 'knowledgeBase') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Knowledge Base</h2>
            <button
              type="button"
              onClick={handleBackToMain}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Support
            </button>
          </div>
          <KnowledgeBaseList 
            onSelectArticle={handleSelectArticle} 
            selectedCategory={selectedCategory}
          />
        </div>
      );
    }

    if (activeView === 'ticketDetail' && selectedTicket) {
      return <TicketDetail ticket={selectedTicket} onBack={handleBackToTickets} />;
    }

    if (activeView === 'tickets') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Your Support Tickets</h2>
            <button
              type="button"
              onClick={handleBackToMain}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Support
            </button>
          </div>
          <TicketList onSelectTicket={handleSelectTicket} />
        </div>
      );
    }

    // Default main view
    return (
      <div className="space-y-8">
        {/* Knowledge Base Categories */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Knowledge Base</h2>
            <button
              type="button"
              onClick={() => setActiveView('knowledgeBase')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Browse All Articles
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportCategories.map((category) => (
              <div 
                key={category.name}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                onClick={() => handleSelectCategory(category.name)}
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                    <category.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <button className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {category.name}
                    </button>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-primary-400"
                  aria-hidden="true"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Your Support Tickets</h2>
            <button
              type="button"
              onClick={() => setActiveView('tickets')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View All Tickets
            </button>
          </div>
          
          {/* Preview of recent tickets */}
          <TicketList 
            onSelectTicket={handleSelectTicket} 
            className="max-h-80 overflow-y-auto"
          />
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFaqs[index] ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                {expandedFaqs[index] && (
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-500">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Contact Support</h2>
          {submitSuccess ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Support Request Received</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Thank you for contacting us. Our support team will get back to you shortly.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setSubmitSuccess(false)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
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
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="#documentation"
              className="flex items-center p-3 rounded-md hover:bg-gray-50"
            >
              <DocumentTextIcon className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-sm text-gray-700">User Documentation</span>
            </a>
            <a
              href="#tutorials"
              className="flex items-center p-3 rounded-md hover:bg-gray-50"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-sm text-gray-700">Video Tutorials</span>
            </a>
            <a
              href="#changelog"
              className="flex items-center p-3 rounded-md hover:bg-gray-50"
            >
              <InboxIcon className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-sm text-gray-700">Changelog & Updates</span>
            </a>
            <a
              href="#api"
              className="flex items-center p-3 rounded-md hover:bg-gray-50"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-sm text-gray-700">API Documentation</span>
            </a>
            <a
              href="#status"
              className="flex items-center p-3 rounded-md hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm text-gray-700">System Status</span>
            </a>
            <a
              href="mailto:support@linkpilot.com"
              className="flex items-center p-3 rounded-md hover:bg-gray-50"
            >
              <PaperAirplaneIcon className="h-5 w-5 text-primary-500 mr-3" />
              <span className="text-sm text-gray-700">Email Support</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
        <p className="mt-1 text-sm text-gray-500">
          Get help with using LinkPilot and managing your LinkedIn outreach
        </p>
      </div>

      {renderView()}
    </div>
  );
};

export default Support;