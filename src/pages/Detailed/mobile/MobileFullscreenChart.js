import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import Button from '@santiment-network/ui/Button'
import Modal from '@santiment-network/ui/Modal'
import PriceBlock from './MobileAssetPriceInfo'
import MobileAssetChart from './MobileAssetChart'
import Title from './MobileAssetTitle'
import ExplanationTooltip from '../../../ducks/SANCharts/SidecarExplanationTooltip'
import MobileAssetChartSelector from './MobileAssetChartSelector'
import styles from './MobileFullscreenChart.module.scss'

const MobileFullscreenChart = ({
  isOpen,
  toggleOpen,
  project,
  timeRange,
  onChangeTimeRange,
  ...props
}) => {
  const [landscapeMode, setLandscapeMode] = useState(false)

  const setOrientation = () => {
    switch (window.orientation) {
      case -90:
      case 90:
        if (!landscapeMode) {
          setLandscapeMode(true)
        }
        break
      default:
        if (landscapeMode) {
          setLandscapeMode(false)
        }
        break
    }
  }

  useEffect(() => {
    window.addEventListener('orientationchange', setOrientation)
    return () => {
      window.removeEventListener('orientationchange', setOrientation)
    }
  })

  const toggleFullScreen = isOpen => {
    toggleOpen(isOpen)

    if (document.body.requestFullscreen) {
      if (isOpen) {
        document.body.requestFullscreen()
        window.screen.orientation
          .lock('landscape-primary')
          .then(() => setLandscapeMode(true))
          .catch(setOrientation)
      } else {
        if (landscapeMode) {
          window.screen.orientation.unlock()
        }
        document.exitFullscreen().catch(err => console.log(err))
      }
    } else {
      setOrientation()
    }
  }

  return (
    <ExplanationTooltip
      className={styles.tooltip}
      localStorageSuffix='MOBILE_FULLSCREEN_CHART'
      align='end'
      position='top'
      dismissOnTouch
      title='Open this chart in fullscreen mode to analyze it in more details'
      description=''
    >
      <Modal
        trigger={
          <Icon
            type='fullscreen-arrows'
            className={styles.icon}
            onClick={() => {
              toggleFullScreen(true)
            }}
          />
        }
        classes={{ wrapper: styles.modal }}
        open={isOpen}
      >
        {closeModal => (
          <section
            className={cx(styles.wrapper, !landscapeMode && styles.dark)}
          >
            <div className={styles.top}>
              <Button
                onClick={() => {
                  toggleFullScreen(false)
                  closeModal()
                }}
                className={cx(styles.button)}
              >
                <Icon type='close' />
              </Button>
              {landscapeMode && (
                <Title slug={project.name} ticker={project.ticker} />
              )}
            </div>
            {landscapeMode ? (
              <>
                <PriceBlock {...project} />
                <MobileAssetChart {...props} />
                <div className={styles.bottom}>
                  <MobileAssetChartSelector
                    onChangeTimeRange={onChangeTimeRange}
                    timeRange={timeRange}
                    isFullscreen
                  />
                </div>
              </>
            ) : (
              <span className={styles.message}>
                Please, turn your phone horizontally to see a fullscreen chart
              </span>
            )}
          </section>
        )}
      </Modal>
    </ExplanationTooltip>
  )
}

export default MobileFullscreenChart
