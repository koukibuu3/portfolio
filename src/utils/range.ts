/** 指定された範囲の整数値の連番を配列で返す */
const range = (start: number, end: number) => {
  return [...Array(end - start + 1)].map((_, i) => start + i)
}

export default range
