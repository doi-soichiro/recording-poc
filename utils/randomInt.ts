// 指定された範囲内の整数値の乱数を生成する
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
