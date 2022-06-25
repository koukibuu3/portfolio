type Page = {
  currentPage: number
  previousPage: number | null
  nextPage: number | null
  items: number[]
  totalCount: number
}

export default Page
