import { useState } from 'react'
import { useScrollEngine } from '../../hooks/useScrollEngine'
import { ROOMS } from '../../data/rooms'
import { RoomIndicator } from '../ui/RoomIndicator'
import { Linh } from '../characters/Linh'
import { WelcomeRoom } from './WelcomeRoom'
import { CatRoom } from './CatRoom'
import { TogetherRoom } from './TogetherRoom'

export function RoomWorld() {
  const [editingSuspended, setEditingSuspended] = useState(false)
  const { worldRef, roomIndex, linhX } =
    useScrollEngine(ROOMS.length, editingSuspended)

  return (
    <>
      {/* Fixed viewport — the entire site lives here */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Horizontal room strip, driven by GSAP x transforms */}
        <div
          ref={worldRef}
          className="flex"
          style={{ width: `${ROOMS.length * 100}vw`, willChange: 'transform' }}
        >
          <WelcomeRoom onEditStateChange={setEditingSuspended} />

          {[1, 2, 3].map((idx) => (
            <CatRoom
              key={ROOMS[idx].id}
              roomIndex={idx}
              onEditStateChange={setEditingSuspended}
            />
          ))}

          <TogetherRoom onEditStateChange={setEditingSuspended} />
        </div>
      </div>

      {/* Single Linh instance — fixed overlay, slides over rooms smoothly */}
      <Linh x={linhX} />

      <RoomIndicator current={roomIndex} />
    </>
  )
}
