import './matchMedia.mock'
import { render } from '@testing-library/react'
import { Homework } from '../utils/types'
import { HomeworkCard } from './HomeworkCard'

describe('HomeworkCard', () => {
  const homework = {
      id: 1,
      title: 'Homework Title',
      assignment: 'Homework Assignment',
      time: '2022-09-27T02:50:02.000Z',
      deadline: '2022-09-27T02:50:02.000Z',
      teacher: 'Teacher Name',
    } as Homework

    const outdatedHomework = {
      ...homework,
      deadline: '2022-09-27T02:50:02.000Z'
    }

    const completedHomework = {
      ...homework,
      completed: true
    }

    const completedOutdatedHomework = {
      ...homework,
      deadline: '2022-09-27T02:50:02.000Z',
      completed: true
    }

  it('renders HomeworkCard', () => {
    const { container } = render(<HomeworkCard homework={homework} />);
    expect(container).toMatchSnapshot();
  })

  it('renders outdated HomeworkCard', () => {
    const { container } = render(<HomeworkCard homework={outdatedHomework} />);
    expect(container).toMatchSnapshot();
  })

  it('renders completed HomeworkCard', () => {
    const { container } = render(<HomeworkCard homework={completedHomework} />);
    expect(container).toMatchSnapshot();
  })

  it('renders completed outdated HomeworkCard', () => {
    const { container } = render(<HomeworkCard homework={completedOutdatedHomework} />);
    expect(container).toMatchSnapshot();
  })
})
