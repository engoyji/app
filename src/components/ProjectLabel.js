import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import ProjectIcon from './ProjectIcon'
import styles from './ProjectLabel.module.scss'

const ProjectLabel = ({ name, ticker, className }) => (
  <div className={cx(styles.label, className)}>
    <ProjectIcon name={name} size={20} />
    <span className={styles.name}>{name}</span>
    <span className={styles.ticker}>({ticker})</span>
  </div>
)

ProjectLabel.propTypes = {
  name: PropTypes.string.isRequired,
  ticker: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default ProjectLabel
