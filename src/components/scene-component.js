import React from 'react'
import { View } from './'
import StaticContainer from './static-container'

export default ({ shouldUpdated, children, ...otherProps }) => {
  return (
    <View {...otherProps}>
      <StaticContainer shouldUpdate={shouldUpdated}>
        {children}
      </StaticContainer>
    </View>
  )
}
