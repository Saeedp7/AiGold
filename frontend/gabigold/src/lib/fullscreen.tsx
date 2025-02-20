import React from 'react'
import './fullscreen.css'

// For touch devices, we don't want to listen to click events but rather touchstart.
const clickEvent = isMobile() ? 'touchstart' : 'click'

type ImageGroupProps = {
  transitionMs?: number
  children: React.ReactNode
}

type ImageGroupStateTypes = {
  currentFocusedImageIndex: number
  isImageGroupExpanded: boolean
  shouldAnimate: boolean
}

type ImageGroupActionTypes = {
  type: string
  payload?: any
}

type ImageProps = {
  src: string
  alt: string
  style?: object
  [k: string]: any
}

function reducer(
  state: ImageGroupStateTypes,
  action: ImageGroupActionTypes
): ImageGroupStateTypes {
  switch (action.type) {
    case ImageGroup.actions.toggleExpand:
      return {
        ...state,
        currentFocusedImageIndex: action.payload.id,
        isImageGroupExpanded: true,
        shouldAnimate: false,
      }
    case ImageGroup.actions.toggleExpandAnimate:
      return {
        ...state,
        currentFocusedImageIndex: action.payload.id,
        isImageGroupExpanded: true,
        shouldAnimate: true,
      }
    case ImageGroup.actions.toggleCloseAnimate:
      return {
        ...state,
        currentFocusedImageIndex: -1,
        isImageGroupExpanded: false,
        shouldAnimate: true,
      }
    default:
      throw new Error(`No case defined for type '${action.type}'.`)
  }
}

export function ImageGroup({
  transitionMs = 250,
  children,
}: ImageGroupProps): any {
  const previousImageButton = React.useRef<HTMLButtonElement>(null)
  const nextImageButton = React.useRef<HTMLButtonElement>(null)
  const isAnimating = React.useRef(false)

  const [state, dispatch] = React.useReducer(reducer, {
    currentFocusedImageIndex: -1,
    isImageGroupExpanded: false,
    shouldAnimate: true,
  })

  const { updatedChildren, numberOfImageChildren } = mapPropsToChildren(
    children,
    (child, index) =>
      React.cloneElement(child, {
        'data-fullscreen-id': index,
        isFocused: index === state.currentFocusedImageIndex,
        shouldAnimate: state.shouldAnimate,
        isImageGroupExpanded: state.isImageGroupExpanded,
        transitionMs,
        onClick: () => {
          // isAnimating flag allows us to prevent another dispatch
          // happening while an animation is taking place.
          if (!isAnimating.current) {
            if (state.shouldAnimate) {
              isAnimating.current = true
              setTimeout(() => {
                isAnimating.current = false
              }, transitionMs)
            }

            if (index === state.currentFocusedImageIndex) {
              dispatch({
                type: ImageGroup.actions.toggleCloseAnimate,
              })
            } else {
              dispatch({
                type:
                  state.currentFocusedImageIndex === -1
                    ? ImageGroup.actions.toggleExpandAnimate
                    : ImageGroup.actions.toggleExpand,
                payload: {
                  id: index,
                },
              })
            }
          }
        },
      })
  )

  // Effect to attach and remove event listeners.
  React.useEffect(() => {
    // Handles outer click to exit out of image
    let clickListener = (e: any) => {
      if (e.target.hasAttribute('data-fullscreen-group')) {
        dispatch({
          type: ImageGroup.actions.toggleCloseAnimate,
        })
      }
    }

    let keyDownListener = (e: any) => {
      if (state.currentFocusedImageIndex !== -1) {
        if (e.key === 'Escape') {
          dispatch({
            type: ImageGroup.actions.toggleCloseAnimate,
          })
        }
        if (e.key === 'ArrowRight') {
          if (nextImageButton.current) nextImageButton.current.focus()
          if (state.currentFocusedImageIndex + 1 === numberOfImageChildren) {
            dispatch({
              type: ImageGroup.actions.toggleExpand,
              payload: {
                id: 0,
              },
            })
          } else {
            dispatch({
              type: ImageGroup.actions.toggleExpand,
              payload: {
                id: state.currentFocusedImageIndex + 1,
              },
            })
          }
        }
        if (e.key === 'ArrowLeft') {
          if (previousImageButton.current) previousImageButton.current.focus()
          if (state.currentFocusedImageIndex - 1 === -1) {
            dispatch({
              type: ImageGroup.actions.toggleExpand,
              payload: {
                id: numberOfImageChildren - 1,
              },
            })
          } else {
            dispatch({
              type: ImageGroup.actions.toggleExpand,
              payload: {
                id: state.currentFocusedImageIndex - 1,
              },
            })
          }
        }
      }
    }

    let resizeListener = () => {
      dispatch({
        type: ImageGroup.actions.toggleCloseAnimate,
      })
      window.removeEventListener('resize', resizeListener)
    }

    let scrollAnimationId = -1
    let initialOffset = 0
    let scrollListener = () => {
      scrollAnimationId = requestAnimationFrame(scrollListener)
      const difference = Math.abs(initialOffset - window.pageYOffset)
      if (difference > 80) {
        dispatch({
          type: ImageGroup.actions.toggleCloseAnimate,
        })
      }
    }

    if (state.isImageGroupExpanded) {
      window.addEventListener(clickEvent, clickListener)
      window.addEventListener('keydown', keyDownListener)
      window.addEventListener('resize', resizeListener)
      initialOffset = window.pageYOffset
      scrollAnimationId = requestAnimationFrame(scrollListener)
    } else {
      window.removeEventListener(clickEvent, clickListener)
      window.removeEventListener('keydown', keyDownListener)
      window.removeEventListener('resize', resizeListener)
      cancelAnimationFrame(scrollAnimationId)
    }

    return () => {
      window.removeEventListener(clickEvent, clickListener)
      window.removeEventListener('keydown', keyDownListener)
      window.removeEventListener('resize', resizeListener)
      cancelAnimationFrame(scrollAnimationId)
    }
  }, [
    state.isImageGroupExpanded,
    numberOfImageChildren,
    state.currentFocusedImageIndex,
  ])

  return (
    <div
      data-fullscreen-group=""
      className={`fullscreen-group sticky-top${
        state.isImageGroupExpanded ? ' fullscreen-group--expanded' : ''
      }`}
      style={{
        transition: `opacity ${transitionMs}ms ease`,
      }}
    >
      {updatedChildren}
      {state.currentFocusedImageIndex !== -1 && (
        <>
          
          <button
            ref={previousImageButton}
            className="fullscreen-toggle toggle--left"
            onClick={() => {
              dispatch({
                type: ImageGroup.actions.toggleExpand,
                payload: {
                  id:
                    state.currentFocusedImageIndex - 1 !== -1
                      ? state.currentFocusedImageIndex - 1
                      : numberOfImageChildren - 1,
                },
              })
            }}
            tabIndex={state.isImageGroupExpanded ? 0 : -1}
            aria-label="Show previous photo"
          >
            <Arrow direction="left" />
          </button>
          <button
            ref={nextImageButton}
            className="fullscreen-toggle toggle--right"
            onClick={() => {
              dispatch({
                type: ImageGroup.actions.toggleExpand,
                payload: {
                  id:
                    state.currentFocusedImageIndex + 1 !== numberOfImageChildren
                      ? state.currentFocusedImageIndex + 1
                      : 0,
                },
              })
            }}
            tabIndex={state.isImageGroupExpanded ? 0 : -1}
            aria-label="Show next photo"
          >
            <Arrow direction="right" />
          </button>
        </>
      )}
    </div>
  )
}

ImageGroup.actions = {
  toggleExpand: 'TOGGLE_EXPAND',
  toggleExpandAnimate: 'TOGGLE_EXPAND_ANIMATE',
  toggleCloseAnimate: 'TOGGLE_CLOSE_ANIMATE',
}

export function Image({ src, alt, style, ...props }: ImageProps) {
  const {
    onClick,
    isFocused,
    shouldAnimate,
    isImageGroupExpanded,
    transitionMs,
    ...rest
  } = props

  const scalingImage = React.useRef<HTMLDivElement>(null)
  const wasPreviouslyFocused = React.useRef(false)
  const initialRender = React.useRef(false)
  React.useEffect(() => {
    if (!initialRender.current) {
      initialRender.current = true
      return
    }

    const element = scalingImage.current
    if (element) {
      if (isFocused) {
        if (shouldAnimate) {
          // Animate in
          calculatePosition('open')(element, transitionMs)
        } else {
          // Immediately show
          calculatePosition('open')(element, 0)
        }

        wasPreviouslyFocused.current = true
      }

      if (!isFocused && wasPreviouslyFocused.current) {
        if (shouldAnimate) {
          // Animate out
          calculatePosition('close')(element, transitionMs)
        } else {
          // Immediately hide
          calculatePosition('close')(element, 0)
        }

        wasPreviouslyFocused.current = false
      }
    }
  }, [isFocused, shouldAnimate, transitionMs])

  return (
    <div className="fullscreen-container" {...rest}>
      <button
        className="fullscreen-btn"
        onClick={onClick}
        tabIndex={isFocused || !isImageGroupExpanded ? 0 : -1}
      >
        <div className="fullscreen-image">
          <img src={src} alt={alt} style={style} />
        </div>
        <div ref={scalingImage} className="fullscreen-image">
          <img src={src} alt={alt} style={style} />
        </div>
      </button>
    </div>
  )
}

Image.displayName = 'Image'

/** mapPropsToChildren
 *  This function takes the children of an ImageGroup
 *  component and recursively maps through each children,
 *  applying props to all Image components.
 */
function mapPropsToChildren(
  children: React.ReactNode,
  fnToApplyToChild: (child: any, index: number) => React.ReactNode
) {
  let numberOfImageChildren = 0

  const recursiveMap = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, child => {
      // @ts-ignore
      if (child.type.displayName === Image.displayName) {
        child = fnToApplyToChild(child, numberOfImageChildren)
        numberOfImageChildren++
        return child
      }

      if (!React.isValidElement(child)) {
        return child
      }

      // @ts-ignore
      if (child.props.children) {
        // @ts-ignore
        child = React.cloneElement(child, {
          // @ts-ignore
          children: recursiveMap(child.props.children),
        })
      }

      return child
    })
  }

  const updatedChildren = recursiveMap(children)

  return {
    updatedChildren,
    numberOfImageChildren,
  }
}

function calculatePosition(action: 'open' | 'close') {
  return function calculate(el: HTMLDivElement, transitionMs: number = 0) {
    if (action === 'open') {
      // 1. Determine whether we are scaling by height or width.
      //    We will scale based on which ever one is smaller.
      // 2. translateX the element to the center of the screen always.
      // 3. If we are scaling by height, translateY based on
      //    the viewport's top / 0px.
      // 4. If we are scaling by width, translateY based on the center
      //    of the viewport height (window.innerHeight / 2)
      const { innerWidth, innerHeight } = window
      const { height, width, top, left } = el.getBoundingClientRect()
      const scaleBy = innerWidth < innerHeight ? 'width' : 'height'
      const scale =
        scaleBy === 'width' ? innerWidth / width : innerHeight / height

      // Calculate translateX to center of x axis.
      const scaledImageWidth = width * scale
      const leftOfWhereScaledImageNeedsToBe =
        innerWidth / 2 - scaledImageWidth / 2
      const leftOfWhereScaledImageIs = left - (scaledImageWidth - width) / 2

      const translateX =
        (leftOfWhereScaledImageNeedsToBe - leftOfWhereScaledImageIs) / scale
      let translateY: number = 0

      if (scaleBy === 'width') {
        const scaledImageHeight = height * scale
        const centerOfScreen = innerHeight / 2

        const topOfWhereImageShouldBe = centerOfScreen - scaledImageHeight / 2

        translateY = (topOfWhereImageShouldBe - top) / scale
      } else {
        translateY = (top / scale) * -1
      }

      el.style.opacity = '1'
      el.style.transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0px)`
      el.style.transition = `transform ${transitionMs}ms ease, opacity 0ms`
      el.style.transformOrigin = '50% 0'
      el.style.zIndex = '9'
      el.style.pointerEvents = 'initial'
      el.style.touchAction = 'initial'

      return
    }

    if (action === 'close') {
      el.style.opacity = '0'
      el.style.transform = `scale(1) translate3d(0px, 0px, 0px)`
      el.style.transition = `transform ${transitionMs}ms ease, opacity 0ms ease ${transitionMs}ms, z-index 0ms ease ${transitionMs}ms`
      el.style.transformOrigin = '50% 0'
      el.style.zIndex = '-1'
      el.style.pointerEvents = 'none'
      el.style.touchAction = 'none'

      return
    }
  }
}

function isMobile() {
  if (typeof document !== `undefined`) {
    return 'ontouchstart' in document.documentElement === true
  }
  return false
}

function Arrow({ direction = 'right' }: { direction: 'left' | 'right' }) {
  return direction === 'right' ? (
    <svg className="ms-1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="10 8 14 12 10 16"></polyline></svg>
  ) : (
    <svg className="ms-1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"  transform="rotate(180)" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="10 8 14 12 10 16"></polyline></svg>
  )
}
