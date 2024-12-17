import dayjs from 'dayjs'

/**
 * 著作権表示
 */
export const Copyright: React.FC = () => {
  const year = dayjs().format('YYYY')

  return (
    <footer className="text-xs font-light text-center mt-12 mb-6">
      &copy; 2021-{year} koukibuu3
    </footer>
  )
}
