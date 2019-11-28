import React, { useState } from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import { MAIN_PRODUCTS } from './Products'
import SmoothDropdownItem from '../../SmoothDropdown/SmoothDropdownItem'
import styles from './SantimentProductsTooltip.module.scss'

const ProductItem = ({
  product: { to, img, title, linkTitle, description, showLink = true },
  className
}) => {
  return (
    <a className={cx(styles.wrapper, className)} href={to}>
      <div className={cx(styles.product, styles.wrapper__product)}>
        {img && <img className={styles.product__img} src={img} alt={title} />}
        <div className={styles.product__info}>
          <div className={styles.product__title}>{title}</div>
          <div className={styles.product__description}>{description}</div>

          {showLink && (
            <MakeLink
              className={cx(styles.wrapper__link)}
              to={to}
              as={'div'}
              title={'Go to ' + linkTitle}
            />
          )}
        </div>
      </div>
    </a>
  )
}

const MakeLink = ({ to, title, className, as: El = 'a' }) => (
  <El href={to} className={cx(styles.link, className)}>
    {title} <Icon className={styles.linkArrow} type='pointer-right' />
  </El>
)

const OpenTrigger = () => (
  <Icon type='arrow-down' className={styles.arrowIcon} />
)
const CloseTrigger = () => <Icon type='arrow-up' className={styles.arrowIcon} />

let timeoutId

const SantimentProductsTooltip = ({
  showArrows = true,
  position = 'start',
  showHeader = true,
  className,
  children,
  products = MAIN_PRODUCTS,
  offsetY = 0,
  offsetX = 0,
  productProps = {}
}) => {
  const [isOpen, setOpenState] = useState(false)

  const setClosed = () => {
    timeoutId = setTimeout(() => setOpenState(false), 150)
  }

  const setOpened = () => {
    timeoutId && clearTimeout(timeoutId)
    setOpenState(false)
  }

  return (
    <SmoothDropdownItem
      className={styles.tooltip}
      trigger={
        <div className={className}>
          {children}
          {showArrows && (
            <div className={cx(styles.arrow, isOpen && styles.opened)}>
              {isOpen ? <CloseTrigger /> : <OpenTrigger />}
            </div>
          )}
        </div>
      }
      onOpen={() => setOpened()}
      onClose={() => setClosed()}
      ddParams={{
        ddStyles: {
          position,
          offsetX: offsetX,
          offsetY: offsetY
        }
      }}
    >
      <div
        className={styles.container}
        onMouseEnter={() => setOpened()}
        onMouseLeave={() => setClosed()}
      >
        {showHeader && (
          <div className={styles.header}>
            <div className={styles.title}>Santiment products</div>
            <MakeLink to='https://santiment.net' title='Go to Santiment.net' />
          </div>
        )}
        <div className={styles.products}>
          {products.map((item, index) => (
            <ProductItem key={index} product={item} {...productProps} />
          ))}
        </div>
      </div>
    </SmoothDropdownItem>
  )
}

export default SantimentProductsTooltip
