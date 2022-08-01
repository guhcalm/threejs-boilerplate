interface ColorInterface {
  on: string
  main: string
  light?: string
  dark?: string
}

export interface ThemeInterface {
  name: "LIGHT" | "DARK"
  palette: {
    background: ColorInterface
    primary: ColorInterface
    secondary: ColorInterface
  }
}
