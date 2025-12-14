'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { QRCodeSVG } from 'qrcode.react'
import { Heart, Download, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface SupportFormData {
  amount: number
}

const FIXED_ACCOUNT = '670100-2223461866/6210'
const FIXED_MESSAGE = 'ImpostorGame - podpora'

export default function SupportPage() {
  const [spaydString, setSpaydString] = useState<string>('')
  const [qrSize] = useState<'medium'>('medium')
  const { register, handleSubmit, watch } = useForm<SupportFormData>({
    defaultValues: { amount: 100 }
  })

  const watchedAmount = watch('amount')

  const generateSPAYD = (amount: number): string => {
    // Simple IBAN conversion for Czech account
    const parts = FIXED_ACCOUNT.split('/')
    const bankCode = parts[1]
    const accountParts = parts[0].split('-')
    const prefix = accountParts[0].padStart(6, '0')
    const number = accountParts[1].padStart(10, '0')
    const bban = bankCode + prefix + number
    const countryCode = 'CZ'
    const ibanForCheck = bban + countryCode + '00'
    const numericIBAN = ibanForCheck.split('').map(char => {
      const code = char.charCodeAt(0)
      return code >= 65 && code <= 90 ? (code - 55).toString() : char
    }).join('')
    const checksum = (98 - Number(BigInt(numericIBAN) % BigInt(97))).toString().padStart(2, '0')
    const iban = countryCode + checksum + bban

    let spayd = 'SPD*1.0'
    spayd += `*ACC:${iban}`
    spayd += `*AM:${amount.toFixed(2)}`
    spayd += `*CC:CZK`
    spayd += `*MSG:${encodeURIComponent(FIXED_MESSAGE)}`

    return spayd
  }

  const onSubmit = (data: SupportFormData) => {
    const spayd = generateSPAYD(data.amount)
    setSpaydString(spayd)
    toast.success('QR kód vygenerován!')
  }

  const downloadQR = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = 'impostor-game-podpora.png'
      link.href = canvas.toDataURL()
      link.click()
      toast.success('QR kód stažen!')
    }
  }

  const copySPAYD = async () => {
    try {
      await navigator.clipboard.writeText(spaydString)
      toast.success('SPAYD řetězec zkopírován!')
    } catch (err) {
      toast.error('Chyba při kopírování')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold">Podpora Impostor Game</h1>
          </div>
          <p className="text-slate-300">
            Pomozte nám udržovat a vylepšovat hru! Vaše podpora je neocenitelná.
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Částka podpory (CZK)
              </label>
              <div className="space-y-3">
                <input
                  {...register('amount', { required: true, min: 1, max: 10000 })}
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-slate-400">
                  <span>10 Kč</span>
                  <span className="text-xl font-bold text-green-400">{watchedAmount} Kč</span>
                  <span>2000 Kč</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Detaily platby</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-slate-400">Účet:</span> {FIXED_ACCOUNT}</div>
                <div><span className="text-slate-400">Zpráva:</span> {FIXED_MESSAGE}</div>
                <div><span className="text-slate-400">Částka:</span> {watchedAmount} CZK</div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Vygenerovat QR kód
            </button>
          </form>

          {spaydString && (
            <div className="mt-8 bg-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Váš QR kód pro podporu</h3>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex justify-center">
                  <QRCodeSVG value={spaydString} size={300} />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex gap-3">
                    <button
                      onClick={downloadQR}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex-1"
                    >
                      <Download size={18} />
                      Stáhnout QR
                    </button>
                    <button
                      onClick={copySPAYD}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex-1"
                    >
                      <Copy size={18} />
                      Kopírovat SPAYD
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      SPAYD řetězec
                    </label>
                    <textarea
                      value={spaydString}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white font-mono text-sm"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}