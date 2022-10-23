import { render } from '@testing-library/react'
import HwLayout from './layout'

describe('Layout', () => {
  it('renders HwLayout', () => {
    const { container } = render(<HwLayout>
      <div>test</div>
    </HwLayout>);
    expect(container).toMatchSnapshot();
  })
})