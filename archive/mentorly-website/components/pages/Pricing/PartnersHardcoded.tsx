import { H2 } from 'components/Headings'
import Panel from 'components/Panel'
import { MultiSlider } from 'components/Slider'
import { VFC } from 'react'
import { useIntl } from 'react-intl'

const sliderSettings = {
  xl: {
    breakpoint: { max: 4000, min: 1280 },
    items: 10,
  },
  desktop: {
    breakpoint: { max: 1280, min: 768 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 768, min: 576 },
    items: 4,
  },
  mobile: {
    breakpoint: { max: 576, min: 0 },
    items: 1,
  },
}

type PartnerType = {
  id: string
  name: string
  url?: string
  imageUrl: string
}

const partnersData: PartnerType[] = [
  {
    id: 'sxsw',
    name: 'SXSW',
    url: 'https://www.sxsw.com/news/2022/2022-mentors-announced-rsvps-open-february-22/#:~:text=Mentor%20Sessions%20provide%20the%20unique,for%20professional%20growth%20and%20development.',
    imageUrl:
      'https://imgproxy.mentorly.com/Vqea09sA8NijwkUAZboIarQNGbhChvlYLGVxwhaMgW0/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlLzE1MTlm/MDZkMjRkMTJkNzdm/MWU0NjE2MzhlNTYz/YWIzLnBuZw',
  },
  {
    id: 'octagon',
    name: 'Octagon',
    url: 'https://www.octagon.com/',
    imageUrl:
      'https://imgproxy.mentorly.com/Txra_HM-qt3PV9UblX78PXObMVxxcHjINz8tS6W1xcA/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlLzQwN2Ez/MmRlNTdkZGJjOTEy/N2IzYTJjMzA2YmI1/MWEwLnBuZw',
  },
  {
    id: 'lululemon',
    name: 'Lululemon',
    url: 'https://shop.lululemon.com/',
    imageUrl: 'https://static.cdnlogo.com/logos/l/85/lululemon.svg',
  },
  {
    id: 'artswa',
    name: 'ArtsWa',
    url: 'https://www.arts.wa.gov/',
    imageUrl:
      'https://imgproxy.mentorly.com/3lomKkeRrR8YwnzW_gfImZUNjex_zySU3vG9XIwHlCI/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlL2RkN2Yx/Mzc3YjZiNzk2MTM3/YzU0ODIwMTgzNWRl/M2ZlLnBuZw',
  },
  {
    id: 'startup-canada',
    name: 'Startup Canada',
    url: 'https://www.startupcan.ca/',
    imageUrl:
      'https://imgproxy.mentorly.com/Me4N5NgGQAxNaO73RIF4IFD4brIQacC0b-fXn8g0-mM/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlLzAxOThj/ZjhjMmNkNzAxM2M1/M2IwOTNjM2VhZTI2/MDM5LnBuZw',
  },
  {
    id: 'bptn',
    name: 'Black Professionals in Tech Network',
    url: 'https://www.bptn.ca/',
    imageUrl:
      'https://imgproxy.mentorly.com/e8vgBzLD1tiBbA9bi-0saDUvtL_5Yu6ZHX99dojQ7vo/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlL2JmYWVi/Y2Q5MDAwYzQ2YzEz/MjRlZjljYTk0MTM0/MzgzLnBuZw',
  },
  {
    id: 'pmi-montreal',
    name: 'PMI-Montréal',
    url: 'https://www.pmimontreal.org/',
    imageUrl:
      'https://imgproxy.mentorly.com/eTOtbG8EQ7Wlk7eyb9o8-oVSoPyFMwC2fevsgStjkvg/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlLzgyYTcw/ZjI1ZWIxMTIxOWVl/MTVjMDI5NzY2ZTlk/YWRhLnBuZw',
  },
  {
    id: 'reseau-mentorat',
    name: 'Réseau Mentorat',
    url: 'https://www.reseaum.com/fr',
    imageUrl:
      'https://imgproxy.mentorly.com/Tk820YrndkkGaPbdAy-EWZj2dmVyxwdXps0V0QeM5yQ/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlLzg2YTUz/ODcyYjk0MTY2MTdm/MWE5NzY5ODEzYTU4/MjZkLmpwZw',
  },
  {
    id: 'seattle-arts',
    name: "Bureau d'art et de la culture de Seattle",
    url: 'https://www.seattle.gov/arts',
    imageUrl:
      'https://imgproxy.mentorly.com/63cpQrLeq8pz3tSyuc5UWhCO-VrpUYROk2FXn4jCLhY/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlLzc0NmIw/MzUwNDE2YWU4MDc3/OWQ2NzUzOTcwODQ5/N2NiLnBuZw',
  },
  {
    id: 'music-incubator',
    name: 'Incubateur de musique canadien',
    url: 'https://canadasmusicincubator.com/fr/',
    imageUrl:
      'https://imgproxy.mentorly.com/3H0136-Dx7K0IOK44C20a4s_o5ohL8Cb5iRrT3pLmyQ/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlLzk3MzQw/MjM5NGZmY2M1NDM5/OWQ5NGVjODZmNTdh/NDM0LnBuZw',
  },
  {
    id: 'university-alberta',
    name: 'U of A',
    imageUrl:
      'https://imgproxy.mentorly.com/NBBuVUPfrcmm-qi1ur5OJSZjwUIbuQ06niAdcVebMj8/s:124:124/czM6Ly91cGxvYWRz/Lm1lbnRvcmx5LmNv/L3N0b3JlL2QwZTg5/ZGI5MTg1MTcyNTE4/YWE4YzAzYjZkZGZh/Yzk2LnBuZw',
  },
  {
    id: 'mit',
    name: 'MIT',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg',
  },
  {
    id: 'bbpa',
    name: 'BBPA',
    url: 'https://bbpa.org/',
    imageUrl: 'https://logo.clearbit.com/bbpa.org',
  },
  {
    id: 'revolutionher',
    name: 'Rev Her',
    url: 'https://revolutionher.com/',
    imageUrl: 'https://logo.clearbit.com/revolutionher.com',
  },
]

const Partner: VFC<{ partner: PartnerType }> = ({ partner }) => {
  const imageElement = (
    <img
      src={partner.imageUrl}
      alt={partner.name}
      style={{ maxHeight: '60px', maxWidth: '120px', objectFit: 'contain' }}
    />
  )

  return (
    <div className="m-6 flex items-center justify-center min-h-16">
      {partner.url ? (
        <a href={partner.url} target="_blank" rel="noopener noreferrer">
          {imageElement}
        </a>
      ) : (
        imageElement
      )}
    </div>
  )
}

export const PartnersHardcoded = () => {
  const intl = useIntl()

  return (
    <Panel color="white" hasWave>
      <H2 className="text-center mt-16">
        {intl.formatMessage({ id: 'header.companiesWhoTrust' })}
      </H2>
      <MultiSlider
        settings={sliderSettings}
        itemClass="flex justify-center items-center"
        removeArrowOnDeviceType={['mobile']}
        autoPlay
        autoPlaySpeed={3000}
        infinite
        arrows={false}
        pauseOnHover={false}
        cssEase="linear"
      >
        {partnersData.map((partner) => (
          <Partner key={partner.id} partner={partner} />
        ))}
      </MultiSlider>
    </Panel>
  )
}
