import React from 'react'
import { useFeaturedTemplates } from '../../ducks/Studio/Template/gql/hooks'
import { getTemplateIdFromURL } from '../../ducks/Studio/Template/utils'
import { getYoutubeIdForLayout } from '../../pages/Marketing/PublicTemplates/PublicTemplateCard'
import VideoModal from '../VideoModal/VideoModal'
import SvgBgImg from './../../assets/banner/cubes.svg'
import styles from './SanbaseBanner.module.scss'

const FireIcon = (
  <svg
    width='32'
    height='33'
    viewBox='0 0 32 33'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M15.3307 9.14826C15.4538 9.08092 15.5995 9.0684 15.7323 9.11377C16.1415 9.25359 16.5149 9.59046 16.8255 9.97439C17.1462 10.3708 17.444 10.872 17.6869 11.4216C18.1679 12.5095 18.47 13.8703 18.2366 15.0731C18.184 15.3442 17.9216 15.5214 17.6506 15.4688C17.3795 15.4162 17.2023 15.1538 17.2549 14.8827C17.4359 13.9501 17.2051 12.8049 16.7723 11.8259C16.5584 11.3421 16.304 10.9197 16.0481 10.6034C15.9896 10.5311 15.933 10.4667 15.8787 10.4098C15.7869 10.7158 15.6496 11.0893 15.4254 11.5285C14.9846 12.3921 14.2173 13.4975 12.8187 14.9109C11.6457 16.0964 11.1502 17.2273 11.0305 18.2298C10.9103 19.2373 11.1638 20.1653 11.574 20.9481C11.9859 21.7342 12.5465 22.3549 13.003 22.7309C13.0747 22.79 13.1417 22.8412 13.2029 22.885C13.2203 22.7265 13.2468 22.545 13.3081 22.3424C13.4496 21.8752 13.7529 21.3707 14.4056 20.6785C15.1418 19.8977 15.386 19.0885 15.6095 18.3414C15.652 18.1996 15.755 18.0838 15.891 18.0254C16.027 17.9669 16.1819 17.9717 16.3141 18.0384C17.4062 18.5903 18.114 19.7198 18.5449 20.7676C18.8335 21.4695 19.0183 22.1847 19.1097 22.7619C20.5437 21.9306 21.0549 20.241 20.9943 18.436C20.9606 17.4318 20.7467 16.4424 20.4462 15.649C20.2961 15.2525 20.1278 14.9143 19.9565 14.6517C19.7812 14.3832 19.621 14.2219 19.4985 14.1445C19.2651 13.997 19.1954 13.6882 19.3428 13.4547C19.4903 13.2213 19.7991 13.1516 20.0326 13.299C20.3244 13.4833 20.5785 13.7751 20.7939 14.1052C21.0132 14.4412 21.2119 14.8472 21.3814 15.2948C21.7202 16.1893 21.9563 17.2869 21.9937 18.4025C22.0677 20.605 21.3554 23.0852 18.846 23.9802C18.6929 24.0349 18.5228 24.0116 18.3899 23.918C18.257 23.8243 18.178 23.6719 18.178 23.5093C18.178 23.0635 18.0147 22.1077 17.62 21.1479C17.3136 20.4027 16.8948 19.7215 16.3656 19.2696C16.1441 19.911 15.8061 20.6508 15.1331 21.3645C14.5363 21.9974 14.3446 22.3701 14.2652 22.6322C14.2243 22.7674 14.2071 22.8926 14.1912 23.0482C14.189 23.0699 14.1868 23.0926 14.1845 23.1163C14.171 23.2554 14.1544 23.427 14.116 23.6113C14.0902 23.7348 14.0234 23.8621 13.9022 23.956C13.7881 24.0445 13.6648 24.0731 13.5734 24.0802C13.4052 24.0934 13.2482 24.0422 13.1411 23.9983C12.9081 23.903 12.638 23.7259 12.3672 23.5028C11.8176 23.0501 11.1678 22.3274 10.6883 21.4123C10.2071 20.4939 9.88818 19.3631 10.0376 18.1113C10.1876 16.8544 10.8039 15.5254 12.1079 14.2075C13.4528 12.8483 14.1515 11.8247 14.5347 11.0739C14.8619 10.433 14.9658 9.98209 15.0466 9.63135C15.0597 9.57433 15.0723 9.51995 15.085 9.46784C15.1185 9.33156 15.2076 9.21559 15.3307 9.14826Z'
      fill='var(--dodger-blue)'
    />
  </svg>
)

const SanbaseBanner = () => {
  const templateId = getTemplateIdFromURL()
  const [templates, loading] = useFeaturedTemplates()

  if (loading || !templateId) {
    return null
  }

  const template = templates.find(({ id }) => +id === templateId)

  if (!template) {
    return null
  }

  const videoId = getYoutubeIdForLayout(template)

  if (!videoId) {
    return null
  }

  const { title, description } = template

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: 'url("' + SvgBgImg + '")'
      }}
    >
      <div className={styles.fireIcon}>{FireIcon}</div>
      <div className={styles.info}>
        <div>
          <div className={styles.title}>
            Hi, this is a chart layout '{title}'{' '}
          </div>

          <div className={styles.explanation}>{description}</div>
        </div>

        <VideoModal videoId={videoId} classes={styles} />
      </div>
    </div>
  )
}

export default SanbaseBanner