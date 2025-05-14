import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  ArrowTopRightOnSquareIcon,
  AdjustmentsHorizontalIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { KnowledgeBaseArticle, supportService } from '../../services/support.service';
import ErrorState from '../common/ErrorState';

interface KnowledgeBaseListProps {
  onSelectArticle: (article: KnowledgeBaseArticle) => void;
  className?: string;
  selectedCategory?: string;
}

const KnowledgeBaseList: React.FC<KnowledgeBaseListProps> = ({ 
  onSelectArticle,
  className = '',
  selectedCategory
}) => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(selectedCategory || '');
  const [tagFilter, setTagFilter] = useState('');

  // Load articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Update category filter when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      setCategoryFilter(selectedCategory);
    }
  }, [selectedCategory]);

  // Fetch knowledge base articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supportService.getKnowledgeBaseArticles(categoryFilter, tagFilter);
      setArticles(data);
    } catch (err) {
      console.error('Error fetching knowledge base articles:', err);
      setError('Failed to load knowledge base articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    // Debounce the search and filter
    const timer = setTimeout(() => {
      fetchArticles();
    }, 500);

    return () => clearTimeout(timer);
  }, [categoryFilter, tagFilter]);

  // Get unique categories from articles
  const categorySet = new Set(articles.map(article => article.category));
  const categories = ['All Categories', ...Array.from(categorySet)];

  // Get unique tags from articles
  const allTags = articles.flatMap(article => article.tags);
  const tagSet = new Set(allTags);
  const tags = ['All Tags', ...Array.from(tagSet)];

  // Filter articles by search query
  const filteredArticles = searchQuery.trim() ? 
    articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) :
    articles;

  // Format date helper
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
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={fetchArticles}
      />
    );
  }

  return (
    <div className={className}>
      <div className="mb-6">
        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search knowledge base..."
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none block pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories
                  .filter(cat => cat !== 'All Categories')
                  .map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))
                }
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <AdjustmentsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="appearance-none block pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Tags</option>
                {tags
                  .filter(tag => tag !== 'All Tags')
                  .map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                  ))
                }
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <TagIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-10">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="w-full text-left block border border-gray-200 rounded-md hover:border-primary-300 hover:shadow-sm transition-all p-4"
            >
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                  {article.title}
                </h3>
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {article.content}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{article.category}</span>
                <span>•</span>
                <span>Updated {formatDate(article.updatedAt)}</span>
                {article.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex flex-wrap gap-1 items-center">
                      {article.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseList;