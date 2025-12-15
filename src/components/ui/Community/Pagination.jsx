const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, totalCount } = pagination;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className="pagination-controls"
      style={{ marginTop: "20px", textAlign: "center" }}
    >
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
          style={{ margin: "0 5px" }}
        >
          {page}
        </button>
      ))}
      <p style={{ marginTop: "10px", fontSize: "small" }}>총 {totalCount}개</p>
    </div>
  );
};

export default Pagination;
