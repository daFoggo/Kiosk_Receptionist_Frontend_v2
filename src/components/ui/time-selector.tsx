import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface TimeSelectorProps {
  value: string
  onChange: (value: string) => void
}
const TimeSelector = ({ value, onChange }: TimeSelectorProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const [selectedHour, selectedMinute] = value.split(':')

  return (
    <div className="flex space-x-2">
      <Select
        value={selectedHour}
        onValueChange={(hour) => onChange(`${hour}:${selectedMinute || '00'}`)}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-2xl">:</span>
      <Select
        value={selectedMinute}
        onValueChange={(minute) => onChange(`${selectedHour || '00'}:${minute}`)}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default TimeSelector