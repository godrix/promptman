import React from 'react'

import Header from './Header'
import PromptList from './PromptList'
import PromptEditor from './PromptEditor'
import { Container, Content } from './styles'

const screen: React.FC = () => {
  return (
    <Container>
      <Header />
      <Content>
        <PromptList />
        <PromptEditor />
      </Content>
    </Container>
  )
}

export default screen
