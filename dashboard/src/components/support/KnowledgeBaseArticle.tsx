import React from 'react';
import { 
  ArrowLeftIcon, 
  DocumentTextIcon,
  TagIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { KnowledgeBaseArticle as ArticleType } from '../../services/support.service';

interface KnowledgeBaseArticleProps {
  article: ArticleType;
  relatedArticles?: ArticleType[];
  onBack: () => void;
  onSelectArticle: (article: ArticleType) => void;
}

const KnowledgeBaseArticle: React.FC<KnowledgeBaseArticleProps> = ({ 
  article, 
  relatedArticles = [],
  onBack,
  onSelectArticle
}) => {
  // Format date helper
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {article.title}
          </h3>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {/* Article metadata */}
        <div className="flex flex-wrap gap-3 mb-6 text-sm text-gray-500">
          <div className="flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            <span>{article.category}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Updated {formatDate(article.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4" />
            {article.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Article content */}
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{article.content}</p>
        </div>

        {/* Was this helpful section */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Was this article helpful?</h4>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Yes, it helped
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              No, I need more help
            </button>
          </div>
        </div>
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h4 className="text-base font-medium text-gray-900 mb-4">Related Articles</h4>
          <div className="space-y-3">
            {relatedArticles.map((related) => (
              <button
                key={related.id}
                onClick={() => onSelectArticle(related)}
                className="flex justify-between items-center w-full px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 text-left"
              >
                <div>
                  <h5 className="text-sm font-medium text-gray-900">{related.title}</h5>
                  <p className="text-xs text-gray-500 mt-1">{related.category}</p>
                </div>
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseArticle;