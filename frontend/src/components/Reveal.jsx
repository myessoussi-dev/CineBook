import { useEffect, useRef, useState } from 'react'

/** Adds `is-in` once the element scrolls into view (one-shot). */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect() }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08, ...options })
    io.observe(el)
    return () => io.disconnect()
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView]
}

/** Fades and lifts its content in when it enters the viewport. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={delay ? { ...style, '--delay': `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
