import React from 'react'

const Skeleton = (props) => {
  // ? Porps
  const { count, children } = props

  const arr = Array(count).fill('_')

  // ? Render(s)
  return (
    <>
      {arr.map((item, index) =>
        React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child) : child
        )
      )}
    </>
  )
}

const Items = (props) => {
  // ? Props
  const { children, className } = props

  // ? Render(s)
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child) : child
      )}
    </div>
  )
}

export const Item = (props) => {
  const { height, width, animated, className, children } = props

  const key = Math.floor(Math.random() * 100)

  return (
    <div
      key={key}
      className={` ${height} ${width} ${
        animated === 'background'
          ? 'animate-pulse bg-red-200'
          : animated === 'border'
            ? 'animate-pulse border-2 border-red-200'
            : 'bg-white'
      } rounded-md  ${className}`}
    >
      {children}
    </div>
  )
}

const _default = Object.assign(Skeleton, {
  Skeleton,
  Items,
  Item,
})

export default _default
