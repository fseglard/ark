import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { ComponentUnderTest } from './basic'

describe('Pagination', () => {
  it('should have no a11y violations', async () => {
    const { container } = render(<ComponentUnderTest count={100} pageSize={10} />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  it('should update page when item is clicked', async () => {
    render(<ComponentUnderTest count={100} pageSize={10} />)

    const pageTwoLink = screen.getByLabelText('page 2')
    expect(pageTwoLink).not.toHaveAttribute('aria-current', 'page')

    await user.click(pageTwoLink)
    expect(pageTwoLink).toHaveAttribute('aria-current', 'page')
  })

  it('should update page when next button is clicked', async () => {
    render(<ComponentUnderTest count={100} pageSize={10} />)

    const pageOneLink = screen.getByLabelText('page 1')
    expect(pageOneLink).toHaveAttribute('aria-current', 'page')

    const nextPageLink = screen.getByText(/next/i)
    await user.click(nextPageLink)

    const pageTwoLink = screen.getByLabelText('page 2')
    expect(pageTwoLink).toHaveAttribute('aria-current', 'page')
  })

  it('should update page when prev button is clicked', async () => {
    render(<ComponentUnderTest count={100} pageSize={10} />)

    const pageTwoLink = screen.getByLabelText('page 2')

    await user.click(pageTwoLink)
    expect(pageTwoLink).toHaveAttribute('aria-current', 'page')

    const prevPageLink = screen.getByText(/prev/i)
    await user.click(prevPageLink)

    const pageOneLink = screen.getByLabelText('page 1')
    expect(pageOneLink).toHaveAttribute('aria-current', 'page')
  })
})
