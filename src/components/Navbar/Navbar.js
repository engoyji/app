import React from 'react'
import { connect } from 'react-redux'
import { NavLink as Link } from 'react-router-dom'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import Button from '@santiment-network/ui/Button'
import Search from './../Search/SearchContainer'
import SmoothDropdown from '../SmoothDropdown/SmoothDropdown'
import SmoothDropdownItem from '../SmoothDropdown/SmoothDropdownItem'
import NavbarHelpDropdown from './NavbarHelpDropdown'
import NavbarProfileDropdown from './NavbarProfileDropdown'
import NavbarAssetsDropdown from './NavbarAssetsDropdown'
import InsightsDropdown from './InsightsDropdown'
import PlanEngage from './PlanEngage'
import SantimentProductsTooltip from './SantimentProductsTooltip/SantimentProductsTooltip'
import { LABS } from './SantimentProductsTooltip/Products'
import UserAvatar from '../../pages/Account/avatar/UserAvatar'
import { checkIsLoggedIn } from '../../pages/UserSelectors'
import { getCurrentSanbaseSubscription } from '../../utils/plans'
import styles from './Navbar.module.scss'

const ExternalLink = ({ children, className, ...rest }) => (
  <a className={cx(className, styles.externalLink)} {...rest}>
    {children}
    <Icon type='external-link' className={styles.externalLinkImg} />
  </a>
)

const PricingLink = connect(state => ({
  isLoggedIn: checkIsLoggedIn(state),
  subscription: getCurrentSanbaseSubscription(state.user.data)
}))(({ isLoggedIn, subscription, dispatch, ...props }) => {
  const hasFreeSubscription = isLoggedIn && !subscription

  if (
    !isLoggedIn ||
    hasFreeSubscription ||
    (subscription && subscription.trialEnd)
  ) {
    return <Link {...props} />
  }

  return null
})

const leftLinks = [
  {
    to: '/feed',
    children: 'Feed',
    as: Link
  },
  {
    to: '/assets',
    children: 'Assets',
    as: Link,
    Dropdown: NavbarAssetsDropdown
  },
  {
    href: 'https://insights.santiment.net/',
    children: 'Insights',
    as: ExternalLink,
    Dropdown: InsightsDropdown
  },
  {
    children: 'Labs',
    as: props => (
      <Link {...props} to={'/labs'}>
        <SantimentProductsTooltip
          imgClassName={styles.imgLab}
          showArrows={false}
          products={LABS}
          position='start'
          showHeader={false}
          offsetX={-330}
          productProps={{
            className: styles.labCard
          }}
        >
          {props.children}
        </SantimentProductsTooltip>
      </Link>
    )
  },
  {
    href: 'https://graphs.santiment.net/',
    children: 'Graphs',
    as: ExternalLink
  },
  {
    to: '/pricing',
    children: 'Pricing',
    as: PricingLink
  }
]

const rightBtns = [
  {
    icon: () => <Icon type='info-round' className={styles.headerIcon} />,
    el: NavbarHelpDropdown,
    links: ['/docs', '/dev-api', '/support'],
    makeActive: true,
    className: styles.help
  }
]

const Navbar = ({ activeLink = '/', isBetaModeEnabled }) => {
  return (
    <header className={styles.header}>
      <SmoothDropdown
        verticalOffset={-8}
        showArrow={false}
        className={cx(styles.wrapper, 'container')}
        screenEdgeXOffset={5}
      >
        <div className={styles.left}>
          <SantimentProductsTooltip
            className={styles.products}
            position='start'
          >
            <Link className={styles.logo} to='/'>
              <svg
                width='32'
                height='32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle cx='16' cy='16' r='15.5' fill='#fff' stroke='#E7EAF3' />
                <path
                  d='M6 15.648c0-.552.135-.966.407-1.242.272-.276.639-.414 1.102-.414.462 0 .83.139 1.101.414.272.276.407.69.407 1.242 0 .572-.135.995-.407 1.27-.272.276-.639.415-1.101.415-.463 0-.83-.139-1.102-.414-.272-.276-.407-.7-.407-1.271zM12.547 20.714c.403.236.88.438 1.434.606a5.853 5.853 0 0 0 1.705.251c.664 0 1.227-.163 1.69-.49.462-.328.694-.858.694-1.591 0-.615-.142-1.12-.423-1.517a4.733 4.733 0 0 0-1.07-1.07c-.433-.317-.901-.609-1.404-.874a7.48 7.48 0 0 1-1.404-.957 4.788 4.788 0 0 1-1.07-1.326c-.283-.511-.423-1.16-.423-1.945 0-1.257.346-2.204 1.04-2.843C14.011 8.319 14.992 8 16.26 8c.824 0 1.539.074 2.142.222.603.147 1.127.35 1.57.606l-.574 1.774a6.31 6.31 0 0 0-1.327-.488 6.231 6.231 0 0 0-1.54-.192c-.724 0-1.251.147-1.584.443-.332.296-.498.76-.498 1.39 0 .493.14.912.423 1.256.281.346.638.66 1.07.947.433.286.901.576 1.404.872.502.296.97.646 1.404 1.05.432.403.789.886 1.07 1.448.283.561.423 1.267.423 2.114a4.51 4.51 0 0 1-.272 1.567c-.18.493-.457.921-.83 1.286a4.075 4.075 0 0 1-1.388.872c-.553.217-1.202.326-1.946.326-.885 0-1.65-.084-2.293-.252-.644-.167-1.188-.389-1.63-.665l.665-1.862zM22.984 15.648c0-.552.136-.966.408-1.242.271-.276.638-.414 1.1-.414.464 0 .83.139 1.102.414.272.276.407.69.407 1.242 0 .572-.135.995-.407 1.27-.272.276-.638.415-1.101.415-.463 0-.83-.139-1.101-.414-.272-.276-.408-.7-.408-1.271z'
                  fill='#2F354D'
                />
              </svg>
            </Link>
          </SantimentProductsTooltip>
          {leftLinks.map(({ Dropdown, ...rest }, index) => {
            const isActive = activeLink.includes(rest.to)

            const button = (
              <Button
                key={index}
                variant='flat'
                isActive={isActive}
                className={cx(Dropdown || styles.leftLink, styles.btn)}
                {...rest}
              />
            )

            if (Dropdown) {
              return (
                <SmoothDropdownItem key={index} trigger={button}>
                  <Dropdown activeLink={activeLink} />
                </SmoothDropdownItem>
              )
            }

            return button
          })}
        </div>

        <div className={styles.right}>
          <Search
            inputProps={{
              placeholder: 'Search for assets...',
              icon: 'search'
            }}
          />
          {rightBtns.map(
            (
              { icon: El, el: Content, links, makeActive, className },
              index
            ) => (
              <SmoothDropdownItem
                key={index}
                trigger={
                  <Button
                    variant='flat'
                    className={cx(styles.btn, styles.rightBtns, className)}
                    isActive={makeActive && links.includes(activeLink)}
                  >
                    <El />
                  </Button>
                }
              >
                <Content activeLink={activeLink} />
              </SmoothDropdownItem>
            )
          )}
          <div className={cx(styles.divider, styles.center)}>
            <PlanEngage />
            <SmoothDropdownItem
              trigger={
                <Button
                  variant='flat'
                  className={cx(
                    styles.btn,
                    styles.rightBtns,
                    styles.accountBtn
                  )}
                >
                  <UserAvatar to='/account' classes={styles} />
                </Button>
              }
            >
              <NavbarProfileDropdown activeLink={activeLink} />
            </SmoothDropdownItem>
          </div>
        </div>
      </SmoothDropdown>
    </header>
  )
}

const mapStateToProps = state => ({
  isBetaModeEnabled: state.rootUi.isBetaModeEnabled
})

const enhance = connect(mapStateToProps)

export default enhance(Navbar)
