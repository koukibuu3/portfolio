import dayjs from 'dayjs'

/**
 * 著作権表示
 */
export const Copyright: React.FC = () => {
  const year = dayjs().format('YYYY')

  return (
    <footer className="text-xs font-light text-center m-4">
      &copy; 2021-{year} koukibuu3
    </footer>
  )
}
