import { render } from '@testing-library/react'
import { TeacherHome } from './TeacherHome'

describe('Layout', () => {
  it('renders HwLayout', () => {
    const { container } = render(<TeacherHome />);
    expect(container).toMatchSnapshot();
  })
})