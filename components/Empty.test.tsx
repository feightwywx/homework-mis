import { render } from '@testing-library/react'
import Empty from './Empty'

describe('Empty', () => {
  it('renders Empty', () => {
    const { container } = render(<Empty />);
    expect(container).toMatchSnapshot();
  })
})