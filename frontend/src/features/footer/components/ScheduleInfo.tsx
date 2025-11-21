import React from 'react'
import type { Schedule } from '../types/footer'

type Props = {
  schedules: Schedule[]
}

export default function ScheduleInfo({ schedules }: Props) {
  return (
    <div className="space-y-6">
      {schedules.map((schedule, index) => (
        <div key={index} className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{schedule.title}</h3>
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-blue-100">
              <p className="text-sm font-medium">{schedule.days}</p>
              <p className="text-sm">{schedule.hours}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}