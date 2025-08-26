import classNames from 'classnames'
import { handleChildren } from 'components/Generic/util'
import { VerticalWave } from 'components/Wave/VerticalWave'
import { Wave } from 'components/Wave/Wave'
import useWindowSize from 'lib/useWindowSize'
import React, { Children, FC, ReactElement } from 'react'

import styles from './halfpagewave.module.scss'

const WaveBG = ({ color }: { color: string }) => (
  <>
    <div
      className={`${styles.centerWave} overflow-hidden flex-0 w-16 h-full absolute top-0 bottom-0 right-0 hidden md:block`}
    >
      <VerticalWave color={color} />
    </div>
    <div
      className={`overflow-hidden flex-0 w-full h-1/4 absolute bottom-0 block md:hidden`}
    >
      <Wave color="white" />
    </div>
    <div
      className={`${styles.background} absolute left-0 w-full top-0 h-full`}
      style={{ backgroundColor: color || '#fdde35' }}
    ></div>
  </>
)

type HalfPageWave = {
  children: ReactElement[]
  color: string
}

const HalfPageWave: FC<HalfPageWave> = ({ children, color }) => {
  const { width } = useWindowSize()
  return (
    <div className="relative w-full h-full">
      <div className={'flex flex-col md:flex-row fillHeight'}>
        <section className="relative w-full md:w-1/2 flex items-center md:justify-start">
          <WaveBG color={color} />
          <div
            className={classNames(
              'mx-0 w-full wrapper pt-12 pb-20',
              'sm:px-8 sm:nowrap',
              'md:px-0 md:pl-12 md:pt-20 md:pb-20 md:mx-auto',
              'lg:pl-16'
            )}
          >
            <div
              className={classNames(
                'halfContainer',
                'ml-auto pr-0',
                'md:pr-20',
                'lg:pr-24',
                'xl:pr-32'
              )}
            >
              {handleChildren(Children.toArray(children)[0])}
            </div>
          </div>
        </section>
        <section className="relative w-full md:w-1/2 flex items-center md:justify-end">
          <div
            className={classNames(
              'mx-auto wrapper pb-12 pt-10',
              'sm:px-8 sm:nowrap',
              'md:pl-12 md:pt-20 md:pr-16',
              'lg:pl-16'
            )}
          >
            <div
              className={classNames(
                'halfContainer',
                width && width > 767 ? 'pl-12 pt-8' : 'pl-0' // @TODO: until bug is found
              )}
            >
              {handleChildren(Children.toArray(children)[1])}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HalfPageWave
