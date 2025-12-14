'use client'

import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Copy, Heart, Smartphone, CreditCard, Shield } from 'lucide-react'
import { toast } from 'sonner'

const FIXED_ACCOUNT = '670100-2223461866/6210'
const FIXED_MESSAGE = 'ImpostorGame - podpora'

export default function SupportForm() {
  const [amount, setAmount] = useState<number>(20)
  const [spaydString, setSpaydString] = useState<string>('')
  const qrRef = useRef<HTMLDivElement>(null)

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

  // Generate QR code when component mounts or amount changes
  useEffect(() => {
    const spayd = generateSPAYD(amount)
    setSpaydString(spayd)
  }, [amount])

  const downloadQR = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg')
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)

        const link = document.createElement('a')
        link.download = 'impostor-game-podpora.svg'
        link.href = svgUrl
        link.click()

        URL.revokeObjectURL(svgUrl)
        toast.success('QR kód stažen!')
      }
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

  const presetAmounts = [20, 50, 100, 200]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Částka podpory (CZK)
          </label>

          {/* Preset amounts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {presetAmounts.map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                onClick={() => setAmount(presetAmount)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  amount === presetAmount
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {presetAmount} Kč
              </button>
            ))}
          </div>

          {/* Slider and manual input */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <input
                type="range"
                min="10"
                max="10000"
                step="10"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-slate-400 mt-2">
                <span>10 Kč</span>
                <span>10 000 Kč</span>
              </div>
            </div>
            <div className="w-full sm:w-32">
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value >= 10) {
                    setAmount(value)
                  }
                }}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Kč"
              />
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-xl font-bold text-red-400">{amount} Kč</span>
          </div>
        </div>
      </div>

      {spaydString && (
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <h4 className="text-lg font-semibold mb-4 text-center text-slate-100">
            <Heart className="w-5 h-5 text-red-400 inline mr-2" />
            Váš QR kód pro podporu
          </h4>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex justify-center">
              <div ref={qrRef}>
                <QRCodeSVG value={spaydString} size={250} />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="bg-slate-600 rounded-lg p-4">
                <h5 className="font-medium text-slate-200 mb-2">Detaily platby</h5>
                <div className="space-y-1 text-sm">
                  <div><span className="text-slate-400">Účet:</span> {FIXED_ACCOUNT}</div>
                  <div><span className="text-slate-400">Zpráva:</span> {FIXED_MESSAGE}</div>
                  <div><span className="text-slate-400">Částka:</span> {amount} CZK</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadQR}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex-1"
                >
                  <Download size={18} />
                  Stáhnout QR
                </button>
              
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment info */}
      <div className="bg-slate-700 rounded-lg p-4 border border-slate-600 mt-6">
        <h5 className="font-medium text-slate-200 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-400" />
          Jak probíhá platba
        </h5>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Naskenujte QR kód v aplikaci vaší banky</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>Platba probíhá přímo přes váš bankovní účet</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span>Bezpečná platba podle české bankovní standardy</span>
          </div>
        </div>
      </div>
    </div>
  )
}