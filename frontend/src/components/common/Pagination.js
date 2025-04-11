// Pagination.js
import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5
}) => {
  if (totalPages <= 1) return null;

  // Calculate page numbers to show
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = startPage + maxPageNumbers - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = showPageNumbers ? getPageNumbers() : [];

  return (
    <div className="pagination-container">
      <button 
        className="pagination-btn pagination-prev" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {showPageNumbers && (
        <div className="pagination-numbers">
          {currentPage > Math.floor(maxPageNumbers / 2) + 1 && (
            <>
              <button 
                className="pagination-number" 
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {currentPage > Math.floor(maxPageNumbers / 2) + 2 && (
                <span className="pagination-ellipsis">...</span>
              )}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button 
              key={number}
              className={`pagination-number ${currentPage === number ? 'active' : ''}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          ))}
          
          {currentPage < totalPages - Math.floor(maxPageNumbers / 2) && (
            <>
              {currentPage < totalPages - Math.floor(maxPageNumbers / 2) - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button 
                className="pagination-number" 
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
      )}
      
      <button 
        className="pagination-btn pagination-next" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      
      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;