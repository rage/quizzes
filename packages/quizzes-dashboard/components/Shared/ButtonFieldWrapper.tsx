import styled from "styled-components"

export const ButtonFieldWrapper = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  width: 100%;

  .MuiButton-label {
    font-size: 1.2rem;
    padding: 0.5rem;
  }

  .button-accept {
    background-color: #78ab46;
    color: white;
    :hover {
      background-color: #78ab46;
      opacity: 0.6;
      color: #000;
    }
  }

  .button-reject {
    background-color: #c62828;
    color: white;

    :hover {
      background-color: #c62828;
      opacity: 0.6;
      color: #000;
    }
  }
`
