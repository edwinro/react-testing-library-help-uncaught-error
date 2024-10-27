import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'


class ComponentToTest extends React.PureComponent {

  constructor(props, context) {
    super(props, context)
    this.state= {
      flag : undefined // shown to user if an error occurs
    }
  }

  render() {
    return <div>
      <div onClick={async () => {
        const someCheckResult = false; // assume check fails - this is what we want to test
        if (!someCheckResult) {
          this.setState({flag: "Error code 123"})
          throw new Error('Error code 123 handled'); // the error is thrown to prevent further processing down the road. In reality this error is in another method shared by multiple components
        }
      }}>click me</div>
      {this.state.flag ?? ""}
    </div>
  }
}

test('Test flag shown to user - v1', async () => {
  render(<ComponentToTest />);
  const button = screen.getByText(/click me/i);
  await userEvent.click(button);
  await screen.getByText("Error code 123"); // flag show
})

test('Test flag shown to user - v2', async () => {
  try {
    render(<ComponentToTest />);
    const button = screen.getByText(/click me/i);
    await userEvent.click(button);
  } catch (e) {
    // ignore error
  } finally {
    await screen.getByText("Error code 123"); // check flag show
  }

})