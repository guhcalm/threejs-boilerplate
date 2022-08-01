import { createRoot as myRoot } from "react-dom/client"
import { MyContextProvider } from "./context"
import { GlobalStyles } from "./styles"
import { MyApp } from "./_app"

myRoot(document.querySelector("#root") as HTMLDivElement).render(
  <MyContextProvider>
    <GlobalStyles />
    <MyApp />
  </MyContextProvider>
)
