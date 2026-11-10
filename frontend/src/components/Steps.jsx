import Icon from './Icon'
import './Steps.css'

const STEPS = ['Seats', 'Payment', 'Confirmation']

/** Booking progress indicator. current: 1, 2 or 3 */
export default function Steps({ current }) {
  return (
    <ol className="steps" aria-label="Booking steps">
      {STEPS.map((label, i) => {
        const n = i + 1
        const state = n < current ? 'done' : n === current ? 'current' : 'todo'
        return (
          <li key={label} className={`step is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="step-dot">{state === 'done' ? <Icon name="check" size={13} strokeWidth={3} /> : n}</span>
            <span className="step-label">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
