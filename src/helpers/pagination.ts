export const getExtraPaginationFields = (pageNumber?: number, pageSize?: number, count?: number) => {
  if (!pageNumber || !pageSize || !count) {
    return {};
  }

  const totalPages = Math.ceil(count / pageSize);
  const prevPage = pageNumber - 1 < 1 ? null : pageNumber - 1;
  const nextPage = pageNumber + 1 <= totalPages ? pageNumber + 1 : null;

  return { totalPages, prevPage, nextPage };
};
