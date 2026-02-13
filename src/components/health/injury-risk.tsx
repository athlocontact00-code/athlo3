"use client"

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, Heart, Moon, Zap, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface InjuryRiskProps {
  currentRisk?: number
}

export default function InjuryRisk({ currentRisk = 35 }: InjuryRiskProps) {
  const riskFactors = [
    { name: 'Wzrost obciążenia', value: 15, weight: 0.8, status: 'warning', icon: TrendingUp },
    { name: 'Deficyt snu', value: 8, weight: 0.6, status: 'good', icon: Moon },
    { name: 'HRV poniżej normy', value: 12, weight: 0.7, status: 'warning', icon: Heart },
    { name: 'Wysokie DOMS', value: 18, weight: 0.9, status: 'alert', icon: User },
    { name: 'Poziom stresu', value: 22, weight: 0.8, status: 'alert', icon: Zap },
  ]

  const getRiskLevel = (risk: number) => {
    if (risk < 25) return { label: 'Niskie', color: 'text-green-400' }
    if (risk < 50) return { label: 'Umiarkowane', color: 'text-yellow-400' }
    if (risk < 75) return { label: 'Wysokie', color: 'text-orange-400' }
    return { label: 'Krytyczne', color: 'text-red-400' }
  }

  const risk = getRiskLevel(currentRisk)

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
        Ryzyko Kontuzji
      </h3>

      {/* Risk gauge */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-800"
            />
            <motion.circle
              cx="50" cy="50" r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - currentRisk / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={currentRisk < 25 ? 'text-green-500' : 
                        currentRisk < 50 ? 'text-yellow-500' :
                        currentRisk < 75 ? 'text-orange-500' : 'text-red-500'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${risk.color}`}>
                {currentRisk}%
              </div>
              <div className="text-xs text-gray-400">Ryzyko</div>
            </div>
          </div>
        </div>
        
        <Badge className={`mt-4 ${
          currentRisk < 25 ? 'bg-green-500/20 text-green-400' :
          currentRisk < 50 ? 'bg-yellow-500/20 text-yellow-400' :
          currentRisk < 75 ? 'bg-orange-500/20 text-orange-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {risk.label}
        </Badge>
      </div>

      {/* Risk factors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Czynniki ryzyka</h4>
        {riskFactors.map((factor, index) => {
          const IconComponent = factor.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">{factor.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.weight * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className={`h-full rounded-full ${
                      factor.status === 'good' ? 'bg-green-500' :
                      factor.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{factor.value}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <h5 className="text-sm font-medium text-blue-400 mb-2">💡 Zalecenia</h5>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Zwiększ czas regeneracji między treningami</li>
          <li>• Priorytetowo potraktuj jakość snu (8+ godzin)</li>
          <li>• Rozważ masaż lub fizjoterapię</li>
        </ul>
      </div>
    </Card>
  )
}