import { Page as PageType } from '~/types'

class Page {
  private currentPage: number
  private previousPage: number | null
  private nextPage: number | null
  private items: number[]

  constructor(
    private offset: number,
    private limit: number,
    private totalCount: number,
  ) {
    this.currentPage = this.getCurrentPage()
    this.previousPage = this.getPreviousPage()
    this.nextPage = this.getNextPage()
    this.items = this.getItems()
  }

  private getCurrentPage(): number {
    return Math.floor(this.offset / this.limit) + 1
  }

  private getPreviousPage(): number | null {
    return this.offset > 0 ? Math.floor(this.offset / this.limit) : null
  }

  private getNextPage(): number | null {
    return this.offset + this.limit < this.totalCount
      ? Math.floor(this.offset / this.limit) + 2
      : null
  }

  private getItems(): number[] {
    const items = []
    for (let i = 0; i < this.totalCount; i += this.limit) {
      items.push(Math.floor(i / this.limit) + 1)
    }
    return items
  }

  public toObject(): PageType {
    return {
      currentPage: this.currentPage,
      previousPage: this.previousPage,
      nextPage: this.nextPage,
      items: this.items,
      totalCount: this.totalCount,
    }
  }
}

export default Page
