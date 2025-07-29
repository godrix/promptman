import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background: #191622;
    color: #E1E1E6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Remover bordas de focus de todos os elementos */
  *:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  /* Remover bordas de focus específicas para botões e elementos clicáveis */
  button:focus,
  input:focus,
  textarea:focus,
  select:focus,
  a:focus,
  div[role="button"]:focus,
  [tabindex]:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  /* Remover bordas de seleção */
  *::selection {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Remover bordas de highlight do navegador */
  *::-moz-focus-inner {
    border: 0;
  }

  /* Remover bordas de highlight específicas */
  *::-webkit-focus-ring-color {
    outline: none !important;
  }



  body, input, button {
    font: 400 16px Roboto, sans-serif;
  }

  strong, h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
  }

  .react-resizable {
    position: relative;
  }

  .react-resizable-handle {
    display: flex;
    justify-content: center;
    user-select: none;
    cursor: ew-resize;
    position: absolute;
    font-size: 24px;

    &::before {
      width: 1px;
      height: 24px;
      background: rgba(255, 255, 255, 0.1);
      content: '';
    }
  }

  .react-resizable-handle-e {
    right: 0;
    padding-right: 6px;
    top: 50%;
    transform: translateY(-50%);
  }

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    width: 500px;
    background: ${props => props.theme.backgrounds.dark};
    border: 1px solid #322D41;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.3);

    &:focus {
      outline: 0;
    }
  }

  ::-webkit-scrollbar {
    width: 8px;

    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
  }
  
  ::-webkit-scrollbar-track {
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`
