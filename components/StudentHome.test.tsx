import { render } from '@testing-library/react'
import { StudentHome } from './StudentHome'

describe('Layout', () => {
  it('renders HwLayout', () => {
    const { container } = render(<StudentHome />);
    expect(container).toMatchSnapshot();
  })
})