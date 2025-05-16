import { useEffect, useState } from "react";
/**
 * this is a simple paging logic used for the demo stuff
 */
const DATA: string[] = [];
const ITEMS_PER_PAGE = 20;

for (let i = 0; i < 110; i++) {
  DATA.push(`item : ${i}`);
}

const getLastItemIndexOfPage = (pageIndex: number) => {
  return pageIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE;
};

const getFirstIndexOfPage = (pageIndex: number) => {
  return pageIndex * ITEMS_PER_PAGE;
};

const getPagedData = (pageIndex: number) => {
  return DATA.slice(
    getFirstIndexOfPage(pageIndex),
    getLastItemIndexOfPage(pageIndex)
  );
};

const SimplePagination = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pagedData, setPagedData] = useState<string[]>([]);

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setPagedData(getPagedData(currentPage));
  }, [currentPage]);

  return (
    <div>
      <h1>Pagination</h1>
      <div>
        {pagedData.map((item) => (
          <p style={{ margin: 0, padding: 0 }}>{item}</p>
        ))}
        <p>
          {pagedData.length}
          items
        </p>
      </div>
      <div>
        <button disabled={currentPage === 0} onClick={goToPrevPage}>
          Back
        </button>
        <span>{currentPage + 1}</span>
        <button
          disabled={DATA.length < getLastItemIndexOfPage(currentPage) + 1}
          onClick={goToNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SimplePagination;
