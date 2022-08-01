import { ReactNode } from "react"
import { useMyContext } from "../../context"
import Container from "./styles"

export default ({ children: App }: { children: ReactNode }) => {
  const { state } = useMyContext()
  return (
    <Container palette={state.theme.palette} data-layout="">
      {App}
    </Container>
  )
}
