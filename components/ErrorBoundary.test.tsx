import { render } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

describe('ErrorBoundary', () => {
  it('renders ErrorBoundary', () => {
    const { container } = render(<ErrorBoundary />);
    expect(container).toMatchSnapshot();
  })
})