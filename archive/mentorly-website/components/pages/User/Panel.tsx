import classNames from 'classnames'

const Panel = ({ children, className }: any) => (
  <section
    className={classNames('flex-col container w-full flex mx-auto', className)}
  >
    {children}
  </section>
)

export default Panel
