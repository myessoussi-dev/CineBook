import Icon from './Icon'
import './Steps.css'

const STEPS = ['Places', 'Paiement', 'Confirmation']

/** Indicateur d'étapes du parcours de réservation. current : 1, 2 ou 3 */
export default function Steps({ current }) {
  return (
    <ol className="steps" aria-label="Étapes de la réservation">
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
