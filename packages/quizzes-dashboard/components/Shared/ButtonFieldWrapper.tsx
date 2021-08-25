import styled from "styled-components"

export const ButtonFieldWrapper = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  width: 100%;

  .MuiButton-label {
    padding: 0.5rem;
  }

  .button-accept {
    font-size: 1.2rem;

    background-color: #78ab46;
    color: white;
    :hover {
      background-color: #78ab46;
      opacity: 0.6;
      color: #000;
    }
  }
  .button-accept-plag-view {
    font-size: 0.95rem;

    background-color: #78ab46;
    color: white;
    :hover {
      background-color: #78ab46;
      opacity: 0.6;
      color: #000;
    }
  }

  .button-reject {
    background-color: #ff1744;
    color: white;
    font-size: 1.2rem;

    :hover {
      background-color: #ff1744;
      opacity: 0.6;
      color: #000;
    }
  }

  .button-reject-plag-view {
    background-color: #ff1744;
    color: white;
    font-size: 0.95rem;

    :hover {
      background-color: #ff1744;
      opacity: 0.6;
      color: #000;
    }
  }

  .button-suspect-plagiarism {
    background-color: #b26500;
    color: white;
    font-size: 1.2rem;

    :hover {
      background-color: #b26500;
      opacity: 0.6;
      color: #000;
    }
  }

  .button-reject-not-plagiarism {
    background-color: #ff6f00;
    color: white;
    font-size: 0.95rem;

    :hover {
      background-color: #ff6f00;
      opacity: 0.6;
      color: #000;
    }
  }
`
