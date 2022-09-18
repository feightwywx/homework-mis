export default function parseMysqlDateTime(input: string) {
  const splited = input.toString().split(/[-T:.Z]/)
  const t = splited.map(parseFloat)
  return new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]))
}
