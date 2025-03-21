import user from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { vi } from 'vitest'
import { nextTick } from 'vue'
import WithField from '../examples/with-field.vue'
import ComponentUnderTest from './pin-input.test.vue'

type RenderFuncParams = Parameters<typeof render>

async function renderOnNextTick(TestComponent: RenderFuncParams[0], options?: RenderFuncParams[1]) {
  const view = render(TestComponent, options)

  await nextTick()

  return view
}

describe('PinInput', () => {
  it('should have the proper aria labels', async () => {
    await renderOnNextTick(ComponentUnderTest)
    expect(screen.queryAllByLabelText('pin code 1 of 3')).toHaveLength(1)
    expect(screen.queryAllByLabelText('pin code 2 of 3')).toHaveLength(1)
    expect(screen.queryAllByLabelText('pin code 3 of 3')).toHaveLength(1)
  })

  it('should autofocus the first input', async () => {
    await renderOnNextTick(ComponentUnderTest, { props: { autoFocus: true } })
    await waitFor(() => expect(screen.getByLabelText('pin code 1 of 3')).toHaveFocus())
  })

  it('should move focus to the next item when enter a value', async () => {
    await renderOnNextTick(ComponentUnderTest)

    await user.type(screen.getByLabelText('pin code 1 of 3'), '1')
    await waitFor(() => expect(screen.getByLabelText('pin code 2 of 3')).toHaveFocus())

    await user.type(screen.getByLabelText('pin code 2 of 3'), '2')
    await waitFor(() => expect(screen.getByLabelText('pin code 3 of 3')).toHaveFocus())
  })

  it('should clear the previous input when pressing backspace', async () => {
    await renderOnNextTick(ComponentUnderTest)

    await user.type(screen.getByLabelText('pin code 1 of 3'), '1')
    await user.type(screen.getByLabelText('pin code 2 of 3'), '2')

    await waitFor(() => expect(screen.getByLabelText('pin code 3 of 3')).toHaveFocus())

    fireEvent.keyDown(screen.getByLabelText('pin code 3 of 3'), { key: 'Backspace' })

    await waitFor(() => expect(screen.getByLabelText('pin code 2 of 3')).toHaveFocus())
    expect(screen.getByLabelText('pin code 2 of 3')).toHaveValue('')
  })

  it('should invoke onValueComplete when all inputs are filled out', async () => {
    const onValueComplete = vi.fn()
    await renderOnNextTick(ComponentUnderTest, { props: { onValueComplete } })

    await user.type(screen.getByLabelText('pin code 1 of 3'), '1')
    await user.type(screen.getByLabelText('pin code 2 of 3'), '2')
    await user.type(screen.getByLabelText('pin code 3 of 3'), '3')

    await waitFor(() =>
      expect(onValueComplete).toHaveBeenCalledWith({
        value: ['1', '2', '3'],
        valueAsString: '123',
      }),
    )
  })

  it('should set one-time-code for autocomplete on fields', async () => {
    await renderOnNextTick(ComponentUnderTest, { props: { otp: true } })

    expect(screen.getByLabelText('pin code 1 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
    expect(screen.getByLabelText('pin code 2 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
    expect(screen.getByLabelText('pin code 3 of 3')).toHaveAttribute('autocomplete', 'one-time-code')
  })

  it('should replace last input calls onValueComplete correctly', async () => {
    const onValueComplete = vi.fn()
    await renderOnNextTick(ComponentUnderTest, { props: { onValueComplete } })

    const input1 = screen.getByLabelText('pin code 1 of 3')
    const input2 = screen.getByLabelText('pin code 2 of 3')
    const input3 = screen.getByLabelText('pin code 3 of 3')

    await user.type(input1, '1')
    await user.type(input2, '2')
    await user.type(input3, '3')

    await waitFor(() =>
      expect(onValueComplete).toHaveBeenCalledWith({
        value: ['1', '2', '3'],
        valueAsString: '123',
      }),
    )
    onValueComplete.mockClear()

    await user.type(input3, '{selectall}{backspace}')
    await waitFor(() => expect(input3).toHaveValue(''))

    await user.type(input3, '3')
    await waitFor(() =>
      expect(onValueComplete).toHaveBeenCalledWith({
        value: ['1', '2', '3'],
        valueAsString: '123',
      }),
    )
  })
})

describe('NumberInput / Field', () => {
  it('should set input as required', async () => {
    await renderOnNextTick(WithField, { props: { required: true } })
    expect(screen.getAllByRole('textbox', { hidden: true })[3]).toBeRequired()
  })

  it('should set input as disabled', async () => {
    await renderOnNextTick(WithField, { props: { disabled: true } })
    expect(screen.getByRole('textbox', { name: /pin code 1 of 3/i })).toBeDisabled()
  })

  it('should set input as readonly', async () => {
    await renderOnNextTick(WithField, { props: { readOnly: true } })
    expect(screen.getByRole('textbox', { name: /pin code 1 of 3/i })).toHaveAttribute('readonly')
  })

  it('should display helper text', async () => {
    await renderOnNextTick(WithField)
    expect(screen.getByText('Additional Info')).toBeInTheDocument()
  })

  it('should display error text when error is present', async () => {
    await renderOnNextTick(WithField, { props: { invalid: true } })
    expect(screen.getByText('Error Info')).toBeInTheDocument()
  })

  it('should focus on input when label is clicked', async () => {
    await renderOnNextTick(WithField)
    await user.click(screen.getByText(/label/i))
    expect(screen.getByRole('textbox', { name: /pin code 1 of 3/i })).toHaveFocus()
  })

  it('should not display error text when no error is present', async () => {
    await renderOnNextTick(WithField)

    expect(screen.queryByText('Error Info')).not.toBeInTheDocument()
  })
})
